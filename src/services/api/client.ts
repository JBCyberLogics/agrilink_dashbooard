export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestOptions<TResponse, TBody = unknown> = {
  path: string;
  method?: ApiMethod;
  body?: TBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  decode: (payload: unknown) => TResponse;
};

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

export class AdminApiClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly credentials: RequestCredentials;

  constructor(options: { baseUrl: string; fetcher?: typeof fetch; credentials?: RequestCredentials }) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.fetcher = options.fetcher ?? fetch;
    this.credentials = options.credentials ?? 'same-origin';
  }

  /**
   * Generic transport only. Call sites must supply a path from an approved,
   * documented backend contract. This workspace intentionally defines no paths.
   */
  async request<TResponse, TBody = unknown>(options: ApiRequestOptions<TResponse, TBody>): Promise<TResponse> {
    const pathOnly = options.path.split(/[?#]/, 1)[0] ?? '';
    let decodedPath: string;
    try { decodedPath = decodeURIComponent(pathOnly); } catch {
      throw new Error('Admin API paths must be absolute paths within the configured API base.');
    }
    if (
      !options.path.startsWith('/')
      || options.path.startsWith('//')
      || options.path.includes('\\')
      || decodedPath.split('/').some((segment) => segment === '.' || segment === '..')
    ) {
      throw new Error('Admin API paths must be absolute paths within the configured API base.');
    }
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? 12_000;
    const timeoutId = globalThis.setTimeout(() => controller.abort(new DOMException('Request timed out.', 'TimeoutError')), timeoutMs);
    const abortFromCaller = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) controller.abort(options.signal.reason);
    else options.signal?.addEventListener('abort', abortFromCaller, { once: true });
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    let response: Response | undefined;

    try {
      response = await this.fetcher(`${this.baseUrl}${options.path}`, {
        method: options.method ?? 'GET',
        credentials: this.credentials,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });
      const contentType = response.headers.get('content-type') ?? '';
      const payload: unknown = contentType.includes('application/json') ? await response.json() : await response.text();
      if (!response.ok) {
        const error = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {};
        throw new AdminApiError(
          typeof error.message === 'string' ? error.message : `Admin API request failed (${response.status}).`,
          response.status,
          typeof error.code === 'string' ? error.code : undefined,
          typeof error.requestId === 'string' ? error.requestId : undefined,
        );
      }
      return options.decode(payload);
    } catch (error) {
      if (error instanceof AdminApiError) throw error;
      if (controller.signal.aborted) {
        const timedOut = controller.signal.reason instanceof DOMException && controller.signal.reason.name === 'TimeoutError';
        throw new AdminApiError(timedOut ? 'Admin API request timed out.' : 'Admin API request was cancelled.', 0, timedOut ? 'TIMEOUT' : 'ABORTED');
      }
      if (response) throw new AdminApiError('Admin API response could not be parsed or validated.', response.status, 'INVALID_RESPONSE');
      throw new AdminApiError('Unable to reach the AgriLink admin API.', 0, 'NETWORK_ERROR');
    } finally {
      globalThis.clearTimeout(timeoutId);
      options.signal?.removeEventListener('abort', abortFromCaller);
    }
  }
}
