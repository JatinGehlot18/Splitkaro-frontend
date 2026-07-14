import { api } from './client';
import {
  BalanceRow,
  Category,
  Expense,
  ExpenseDetail,
  Group,
  GroupDetail,
  LoginResponse,
  Member,
  ReceiptScan,
  User,
} from './types';

export const authApi = {
  login: (method: string) =>
    api.post<LoginResponse>('/auth/login', { method }),
  saveProfile: (name: string, phone: string, token?: string) =>
    api.post<{ user: User; token: string }>(
      '/auth/profile',
      { name, phone },
      token,
    ),
};

export const groupsApi = {
  list: (token?: string) => api.get<Group[]>('/groups', token),
  detail: (id: string, token?: string) =>
    api.get<GroupDetail>(`/groups/${id}`, token),
  toggleFavorite: (id: string, token?: string) =>
    api.post<{ id: string; favorite: boolean }>(
      `/groups/${id}/favorite`,
      {},
      token,
    ),
  create: (payload: { name: string; color: string; invited: string[] }, token?: string) =>
    api.post<Group>('/groups', payload, token),
  search: (id: string, q: string, token?: string) =>
    api.get<{ query: string; results: Expense[] }>(
      `/groups/${id}/expenses/search?q=${encodeURIComponent(q)}`,
      token,
    ),
  expenseDetail: (groupId: string, expenseId: string, token?: string) =>
    api.get<ExpenseDetail>(`/groups/${groupId}/expenses/${expenseId}`, token),
};

export const expensesApi = {
  create: (payload: unknown, token?: string) =>
    api.post<{ id: string; saved: boolean }>('/expenses', payload, token),
};

export const settlementsApi = {
  record: (payload: unknown, token?: string) =>
    api.post<{ id: string; recorded: boolean }>('/settlements', payload, token),
};

export const referenceApi = {
  members: (token?: string) => api.get<Member[]>('/members', token),
  categories: (token?: string) => api.get<Category[]>('/categories', token),
  groupColors: (token?: string) => api.get<string[]>('/group-colors', token),
};

export const receiptsApi = {
  scan: (token?: string) => api.post<ReceiptScan>('/receipts/scan', {}, token),
};

export type { BalanceRow };
