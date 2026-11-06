import { useState, type InputHTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  error?: string;
};

export function PasswordInput({ error, ...inputProps }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`auth-input-wrap${error ? ' auth-input-wrap--invalid' : ''}`}>
      <LockKeyhole className="auth-input-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
      <input
        {...inputProps}
        id="admin-password"
        type={visible ? 'text' : 'password'}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'admin-password-error' : undefined}
      />
      <button
        className="password-visibility"
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={visible ? 'visible' : 'hidden'}
            className="password-visibility__icon"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
          >
            {visible ? <EyeOff size={17} strokeWidth={1.8} aria-hidden="true" /> : <Eye size={17} strokeWidth={1.8} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
