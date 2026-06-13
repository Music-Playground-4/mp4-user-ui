'use client';

// MP4 — 인증 컨텍스트
// 토큰을 localStorage 에 보관하고, 앱 어디서든 useAuth() 로
// 현재 유저 / 로그인 / 회원가입 / 로그아웃에 접근합니다.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  authApi,
  type AuthUser,
  type LoginPayload,
  type SignupPayload,
} from '@/lib/api';

const TOKEN_KEY = 'mp4_token';

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
function writeToken(token: string) {
  if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_KEY, token);
}
function clearToken() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY);
}

type AuthStatus = 'loading' | 'authenticated' | 'guest';

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // 최초 마운트 시 저장된 토큰으로 세션 복원
  useEffect(() => {
    const token = readToken();
    if (!token) {
      setStatus('guest');
      return;
    }
    let cancelled = false;
    authApi
      .me(token)
      .then((u) => {
        if (cancelled) return;
        setUser(u);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, user } = await authApi.login(payload);
    writeToken(token);
    setUser(user);
    setStatus('authenticated');
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const { token, user } = await authApi.signup(payload);
    writeToken(token);
    setUser(user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout(readToken());
    clearToken();
    setUser(null);
    setStatus('guest');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, signup, logout }),
    [user, status, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
