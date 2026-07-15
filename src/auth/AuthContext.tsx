import React, { createContext, useContext, useMemo, useState } from 'react';
import { User } from '../api/types';

type AuthContextValue = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  updateUser: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      refreshToken,
      user,
      setAuth: (t, rt, u) => {
        setToken(t);
        setRefreshToken(rt);
        setUser(u);
      },
      updateUser: setUser,
      signOut: () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      },
    }),
    [token, refreshToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
