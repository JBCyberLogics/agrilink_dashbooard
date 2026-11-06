import { describe, expect, it } from 'vitest';
import { AUTH_INTEGRATION_STATUS, DEV_DASHBOARD_PREVIEW_PATH, getDevelopmentPreviewPath, getDevelopmentPreviewUrl } from '../config/auth.config';
import { authService } from './authService';

describe('authentication integration boundary', () => {
  it('clearly reports the backend integration as not configured', async () => {
    expect(AUTH_INTEGRATION_STATUS).toBe('NOT_CONFIGURED');
    expect(await authService.login({ username: '', password: '' })).toEqual({ status: 'not-configured' });
    expect(await authService.restoreSession()).toEqual({ status: 'not-configured' });
    expect(await authService.logout()).toEqual({ status: 'not-configured' });
  });

  it('only resolves the dashboard preview route in development', () => {
    expect(DEV_DASHBOARD_PREVIEW_PATH).toBe('/__dev/dashboard-preview');
    expect(getDevelopmentPreviewPath(DEV_DASHBOARD_PREVIEW_PATH, true)).toBe('/dashboard');
    expect(getDevelopmentPreviewPath('/__dev/dashboard-preview/settings/security', true)).toBe('/settings/security');
    expect(getDevelopmentPreviewPath(DEV_DASHBOARD_PREVIEW_PATH, false)).toBeNull();
    expect(getDevelopmentPreviewUrl('/settings/security', true)).toBe('/__dev/dashboard-preview/settings/security');
    expect(getDevelopmentPreviewUrl('/settings/security', false)).toBeNull();
  });
});
