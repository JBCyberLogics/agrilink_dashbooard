import type { LucideIcon } from 'lucide-react';
import { StatusPill } from '../ui/StatusPill';

export function ReadinessLine({ icon: Icon, title, detail, status = 'Not tested' }: { icon: LucideIcon; title: string; detail: string; status?: string }) {
  return (
    <div className="readiness-line">
      <span className="readiness-line__icon"><Icon size={17} aria-hidden="true" /></span>
      <span className="readiness-line__text"><strong>{title}</strong><small>{detail}</small></span>
      <StatusPill>{status}</StatusPill>
    </div>
  );
}

