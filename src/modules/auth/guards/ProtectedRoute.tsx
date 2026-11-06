import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthProvider';

export function ProtectedRoute({
  children,
  fallback,
  developmentPreview = false,
}: {
  children: ReactNode;
  fallback: ReactNode;
  developmentPreview?: boolean;
}) {
  const { status } = useAuth();
  if (import.meta.env.DEV && developmentPreview) return children;
  return status === 'authenticated' ? children : fallback;
}
