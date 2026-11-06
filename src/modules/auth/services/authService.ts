import { AUTH_INTEGRATION_STATUS } from '../config/auth.config';
import type { LoginCredentials, LoginResult, LogoutResult, SessionResult } from '../contracts/auth.contract';

/**
 * Backend integration seam. No endpoint is configured, so this service never
 * sends credentials or creates a browser-side session.
 */
export const authService = {
  integrationStatus: AUTH_INTEGRATION_STATUS,

  async login(_credentials: LoginCredentials): Promise<LoginResult> {
    return { status: 'not-configured' };
  },

  async restoreSession(): Promise<SessionResult> {
    return { status: 'not-configured' };
  },

  async logout(): Promise<LogoutResult> {
    return { status: 'not-configured' };
  },
};
