export const LOGIN_PATH = '/login';
export const DEV_DASHBOARD_PREVIEW_PATH = '/__dev/dashboard-preview';
export const AUTH_INTEGRATION_STATUS = 'NOT_CONFIGURED' as const;

export function getDevelopmentPreviewPath(pathname: string, isDevelopment: boolean): string | null {
  if (!isDevelopment) return null;
  if (pathname === DEV_DASHBOARD_PREVIEW_PATH) return '/dashboard';

  const prefix = `${DEV_DASHBOARD_PREVIEW_PATH}/`;
  if (!pathname.startsWith(prefix)) return null;

  const dashboardPath = pathname.slice(DEV_DASHBOARD_PREVIEW_PATH.length);
  return dashboardPath || '/dashboard';
}

export function getDevelopmentPreviewUrl(pathname: string, isDevelopment: boolean): string | null {
  if (!isDevelopment || !pathname.startsWith('/')) return null;
  return pathname === '/dashboard'
    ? DEV_DASHBOARD_PREVIEW_PATH
    : `${DEV_DASHBOARD_PREVIEW_PATH}${pathname}`;
}
