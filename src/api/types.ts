export type Member = {
  id: string;
  name: string;
  first: string;
  initials: string;
  avatarBg: string;
  isMe?: boolean;
};

export type User = Member & { email: string; profilePictureUrl?: string };

/** Raw shape returned by GET/PUT /api/users (Swagger: UserSummary). */
export type UserSummary = {
  id: string;
  email: string;
  displayName: string;
  profilePictureUrl?: string;
};

/** Raw shape returned by /api/auth/{register,login,refresh,google} (Swagger: AuthResponse). */
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type Group = {
  id: string;
  name: string;
  memberLabel: string;
  net: number;
  tint: string;
  emoji: string;
  favorite: boolean;
};

export type BalanceRow = {
  id: string;
  label: string;
  initials: string;
  avatarBg: string;
  direction: 'owe' | 'owed';
  amount: number;
};

export type Expense = {
  id: string;
  title: string;
  category: string;
  paidByName: string;
  amount: number;
  tint: string;
  icon: string;
  date: string;
};

export type GroupDetail = Group & {
  members: Member[];
  balances: { overallOwed: number; rows: BalanceRow[] };
  expenses: Expense[];
};

export type ExpenseDetail = {
  id: string;
  title: string;
  category: string;
  amount: number;
  icon: string;
  tint: string;
  paidByName: string;
  splitLabel: string;
  addedAt: string;
  hasReceipt: boolean;
  split: { name: string; amount: number }[];
};

export type Category = { id: string; label: string; icon: string; tint: string };

export type ReceiptScan = {
  merchant: string;
  amount: number;
  category: string;
  date: string;
  targetGroup: string;
};
