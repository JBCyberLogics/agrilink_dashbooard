import logoUrl from '../../../../images/logo.png';
import './auth-loading.css';

export function AuthLoading() {
  return (
    <main className="auth-loading" role="status" aria-live="polite">
      <img src={logoUrl} alt="AgriLink Control" />
      <span className="route-loading__spinner" aria-hidden="true" />
      <span>Checking administrator session</span>
    </main>
  );
}
