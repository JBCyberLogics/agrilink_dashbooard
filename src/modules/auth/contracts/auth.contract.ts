import type { CurrentAdministrator } from '../../../contracts/api';

export type LoginCredentials = {
  username: string;
  password: string;
};

/** Identity and expiry metadata only. Session secrets stay in backend-managed cookies. */
export type AuthenticatedSession = {
  administrator: CurrentAdministrator;
  expiresAt: string | null;
};

export type LoginResult =
  | { status: 'authenticated'; session: AuthenticatedSession }
  | { status: 'not-configured' }
  | { status: 'rejected' }
  | { status: 'error' };

export type SessionResult =
  | { status: 'authenticated'; session: AuthenticatedSession }
  | { status: 'unauthenticated' }
  | { status: 'not-configured' }
  | { status: 'error' };

export type LogoutResult =
  | { status: 'signed-out' }
  | { status: 'not-configured' }
  | { status: 'error' };
