/**
 * Frontend integration shapes, not an AgriLink server contract.
 * Confirm field names and error envelopes with the backend team before wiring routes.
 */
export type PaginationRequest = {
  cursor?: string;
  limit?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | undefined>;
};

export type PaginatedResponse<TRecord> = {
  items: TRecord[];
  nextCursor?: string | null;
  total?: number;
};

export type ApiErrorEnvelope = {
  code?: string;
  message?: string;
  requestId?: string;
};

export type CurrentAdministrator = {
  id: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  mfaEnrolled: boolean;
};

export type IntegrationState = 'connected' | 'disconnected' | 'configured' | 'not-configured' | 'operational' | 'degraded' | 'failed' | 'blocked' | 'not-tested' | 'disabled';

export type ServiceDiagnostic = {
  service: string;
  state: IntegrationState;
  checkedAt: string;
  latencyMs?: number;
  detail?: string;
};
