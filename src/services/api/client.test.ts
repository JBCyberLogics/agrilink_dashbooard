import { describe, expect, it, vi } from 'vitest';
import { AdminApiClient, AdminApiError } from './client';

describe('AdminApiClient generic transport', () => {
  it('requires an explicit path and decodes the response at the boundary', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ count: 4 }));
    const client = new AdminApiClient({ baseUrl: 'https://admin.example.invalid/api', fetcher });
    const result = await client.request({ path: '/overview', decode: (payload) => {
      if (typeof payload !== 'object' || payload === null || !('count' in payload) || typeof payload.count !== 'number') throw new Error('Invalid overview response.');
      return { count: payload.count };
    } });
    expect(result).toEqual({ count: 4 });
    expect(fetcher).toHaveBeenCalledWith('https://admin.example.invalid/api/overview', expect.objectContaining({ credentials: 'same-origin' }));
  });

  it('rejects paths that could escape the configured API base', async () => {
    const client = new AdminApiClient({ baseUrl: 'https://admin.example.invalid/api', fetcher: vi.fn<typeof fetch>() });
    await expect(client.request({ path: '//other.example.invalid', decode: (payload) => payload })).rejects.toThrow('within the configured API base');
    await expect(client.request({ path: '/users/../secrets', decode: (payload) => payload })).rejects.toThrow('within the configured API base');
    await expect(client.request({ path: '/users/%2e%2e/secrets', decode: (payload) => payload })).rejects.toThrow('within the configured API base');
  });

  it('preserves structured server errors without treating them as empty data', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ code: 'FORBIDDEN', message: 'Not authorized', requestId: 'test-only' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    }));
    const client = new AdminApiClient({ baseUrl: 'https://admin.example.invalid/api', fetcher });
    await expect(client.request({ path: '/restricted', decode: (payload) => payload })).rejects.toMatchObject<Partial<AdminApiError>>({ status: 403, code: 'FORBIDDEN', requestId: 'test-only' });
  });
});
