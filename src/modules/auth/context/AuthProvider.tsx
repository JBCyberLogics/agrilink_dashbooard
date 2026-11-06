import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthenticatedSession, LoginCredentials, LoginResult } from '../contracts/auth.contract';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'not-configured';

type AuthContextValue = {
  status: AuthStatus;
  session: AuthenticatedSession | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(authService.integrationStatus === 'NOT_CONFIGURED' ? 'not-configured' : 'checking');
  const [session, setSession] = useState<AuthenticatedSession | null>(null);

  useEffect(() => {
    let active = true;
    if (authService.integrationStatus === 'NOT_CONFIGURED') return () => { active = false; };

    setStatus('checking');
    void authService.restoreSession().then((result) => {
      if (!active) return;
      if (result.status === 'authenticated') {
        setSession(result.session);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus(result.status === 'not-configured' ? 'not-configured' : 'unauthenticated');
      }
    }).catch(() => {
      if (!active) return;
      setSession(null);
      setStatus('unauthenticated');
    });

    return () => { active = false; };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.status === 'authenticated') {
      setSession(result.session);
      setStatus('authenticated');
    } else if (result.status === 'rejected') {
      setSession(null);
      setStatus('unauthenticated');
    } else if (result.status === 'not-configured') {
      setSession(null);
      setStatus('not-configured');
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    const result = await authService.logout();
    if (result.status === 'signed-out') {
      setSession(null);
      setStatus('unauthenticated');
    } else if (result.status === 'not-configured') {
      setSession(null);
      setStatus('not-configured');
    }
  }, []);

  const value = useMemo(() => ({ status, session, login, logout }), [status, session, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
