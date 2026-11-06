import { motion, MotionConfig } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import logoUrl from '../../../../images/logo.png';
import { useAuth } from '../context/AuthProvider';
import { LoginBrandPanel } from '../components/LoginBrandPanel';
import { LoginForm } from '../components/LoginForm';
import './auth.css';

type Theme = 'light' | 'dark';

export function LoginPage({
  theme,
  onToggleTheme,
  onAuthenticated,
  onDevelopmentPreview,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onAuthenticated: () => void;
  onDevelopmentPreview?: () => void;
}) {
  const { status } = useAuth();

  return (
    <MotionConfig reducedMotion="user">
      <main className="auth-page">
        <a className="auth-skip-link" href="#admin-username">Skip to sign in</a>
        <LoginBrandPanel onDevelopmentPreview={onDevelopmentPreview} />
        <section className="auth-panel" aria-labelledby="login-title">
          <div className="auth-panel__topline">
            <img className="auth-panel__mobile-logo" src={logoUrl} alt="AgriLink Control" />
            <button
              className="auth-theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={onToggleTheme}
            >
              {theme === 'light' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
            </button>
          </div>

          <motion.div
            className="auth-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="auth-heading">
              <span className="auth-heading__status"><span /> Identity service · {status === 'not-configured' ? 'NOT_CONFIGURED' : status === 'checking' ? 'CHECKING' : status === 'authenticated' ? 'CONNECTED' : 'SIGN IN REQUIRED'}</span>
              <h2 id="login-title">Administrator sign in</h2>
              <p>Access the AgriLink Control workspace.</p>
            </div>
            <LoginForm onAuthenticated={onAuthenticated} />
          </motion.div>
        </section>
      </main>
    </MotionConfig>
  );
}
