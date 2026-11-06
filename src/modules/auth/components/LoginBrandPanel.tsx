import { useState } from 'react';
import { motion } from 'motion/react';
import logoUrl from '../../../../images/logo.png';
import maizeUrl from '../../../../images/maize.jpeg';

export function LoginBrandPanel({ onDevelopmentPreview }: { onDevelopmentPreview?: () => void }) {
  const [imageAvailable, setImageAvailable] = useState(true);

  return (
    <motion.aside
      className="login-brand"
      aria-label="AgriLink Control"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {imageAvailable && (
        <motion.img
          className="login-brand__image"
          src={maizeUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          initial={{ opacity: 0.72, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          onError={() => setImageAvailable(false)}
        />
      )}
      <div className="login-brand__wash" aria-hidden="true" />
      <div className="login-brand__content">
        <img className="login-brand__logo" src={logoUrl} alt="AgriLink Control" />
        <div className="login-brand__copy">
          <span className="login-brand__eyebrow">ADMINISTRATION WORKSPACE</span>
          <h1>Intelligent control for a connected agricultural marketplace.</h1>
          <p>One clear view across the systems that connect farms, markets, and people.</p>
        </div>
      </div>
      {onDevelopmentPreview && (
        <div className="login-brand__footer">
          <button className="auth-preview-link" type="button" onClick={onDevelopmentPreview}>
            Open development preview <span>↗</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
