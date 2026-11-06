import { Database } from 'lucide-react';
import { StatusPill } from '../ui/StatusPill';

export function BackendNotice({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`backend-notice${compact ? ' backend-notice--compact' : ''}`} aria-labelledby="backend-notice-title">
      <div className="backend-notice__icon"><Database size={18} aria-hidden="true" /></div>
      <div className="backend-notice__body">
        <div className="backend-notice__heading">
          <h2 id="backend-notice-title">Admin API contract required</h2>
          <StatusPill tone="blocked">Blocked</StatusPill>
        </div>
        <p>This workspace has no documented admin endpoints, identity contract, or permission schema to call. Live records and privileged actions are unavailable until those server contracts are connected.</p>
      </div>
    </section>
  );
}

