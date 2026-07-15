import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { configureAuthClient } from '../api/client';
import { getNavActions } from '../nav/navigation';
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

  // Read via refs inside configureAuthClient's hooks so they always see the
  // latest tokens rather than whatever was current when the effect ran.
  const refreshTokenRef = useRef(refreshToken);
  refreshTokenRef.current = refreshToken;

  useEffect(() => {
    configureAuthClient({
      getRefreshToken: () => refreshTokenRef.current,
      onTokensRefreshed: (accessToken, newRefreshToken) => {
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
      },
      onSessionExpired: () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
        getNavActions()?.reset('Login');
      },
    });
  }, []);

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
