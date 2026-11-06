import type { LoginCredentials } from '../contracts/auth.contract';

export type LoginFieldErrors = { username?: string; password?: string };

/** Presence checks only; credential validity belongs to the backend. */
export function validateLoginCredentials(credentials: LoginCredentials): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  if (!credentials.username.trim()) errors.username = 'Enter your username.';
  if (!credentials.password) errors.password = 'Enter your password.';
  return errors;
}
