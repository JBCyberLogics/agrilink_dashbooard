import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderCircle, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { validateLoginCredentials } from '../lib/validateLoginCredentials';
import { PasswordInput } from './PasswordInput';

const fieldEntrance = {
  hidden: { opacity: 0, y: 9 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

const formEntrance = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.14 } },
};

export function LoginForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { login, status } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const nextErrors = validateLoginCredentials({ username, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      if (nextErrors.username) usernameRef.current?.focus();
      else document.getElementById('admin-password')?.focus();
      return;
    }

    const backendConfigured = status !== 'not-configured';
    if (backendConfigured) setSubmitting(true);
    try {
      const result = await login({ username: username.trim(), password });
      if (result.status === 'authenticated') {
        onAuthenticated();
      } else if (result.status === 'not-configured') {
        setFeedback('Administrator sign-in is not connected yet.');
      } else if (result.status === 'rejected') {
        setPassword('');
        setFeedback('Sign-in failed. Check your details and try again.');
      } else {
        setFeedback('Unable to sign in right now. Try again.');
      }
    } catch {
      setFeedback('Unable to sign in right now. Try again.');
    } finally {
      if (backendConfigured) setSubmitting(false);
    }
  }

  return (
    <motion.form
      id="login-form"
      className="auth-form"
      onSubmit={handleSubmit}
      noValidate
      initial="hidden"
      animate="visible"
      variants={formEntrance}
    >
      <motion.div className="auth-field" variants={fieldEntrance}>
        <label htmlFor="admin-username">Username</label>
        <div className={`auth-input-wrap${errors.username ? ' auth-input-wrap--invalid' : ''}`}>
          <UserRound className="auth-input-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
          <input
            ref={usernameRef}
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            inputMode="text"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Your administrator username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              if (errors.username) setErrors((current) => ({ ...current, username: undefined }));
            }}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'admin-username-error' : undefined}
            disabled={submitting}
          />
        </div>
        {errors.username && <span className="auth-field-error" id="admin-username-error">{errors.username}</span>}
      </motion.div>

      <motion.div className="auth-field" variants={fieldEntrance}>
        <label htmlFor="admin-password">Password</label>
        <PasswordInput
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
          }}
          error={errors.password}
          disabled={submitting}
        />
        {errors.password && <span className="auth-field-error" id="admin-password-error">{errors.password}</span>}
      </motion.div>

      <motion.button
        className="auth-submit"
        type="submit"
        disabled={submitting}
        variants={fieldEntrance}
        whileHover={submitting ? undefined : { y: -1 }}
        whileTap={submitting ? undefined : { scale: 0.99 }}
      >
        {submitting && <LoaderCircle className="auth-submit__spinner" size={17} aria-hidden="true" />}
        <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {feedback && (
          <motion.p
            className="auth-feedback"
            role="alert"
            aria-live="assertive"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
