import {
  AlertCircle,
  Database,
  FileSearch,
  LoaderCircle,
  ShieldAlert,
} from 'lucide-react';

type RequestStateProps =
  | { state: 'loading'; title?: string; detail?: string }
  | { state: 'empty'; title: string; detail: string }
  | { state: 'unavailable'; title: string; detail: string }
  | { state: 'error'; title: string; detail: string; onRetry?: () => void }
  | { state: 'forbidden'; title?: string; detail?: string };

const DEFAULTS = {
  loading: { title: 'Loading records', detail: 'Waiting for the service response.' },
  forbidden: { title: 'Access denied', detail: 'Your administrator role cannot access this resource.' },
};

export function RequestState(props: RequestStateProps) {
  const defaults = props.state === 'loading' || props.state === 'forbidden' ? DEFAULTS[props.state] : undefined;
  const title = props.title ?? defaults?.title ?? '';
  const detail = props.detail ?? defaults?.detail ?? '';
  const isAlert = props.state === 'error' || props.state === 'forbidden';
  const Icon = props.state === 'loading'
    ? LoaderCircle
    : props.state === 'error'
      ? AlertCircle
      : props.state === 'forbidden'
        ? ShieldAlert
        : props.state === 'empty'
          ? FileSearch
          : Database;

  return (
    <div className={`request-state request-state--${props.state}`} role={isAlert ? 'alert' : 'status'} aria-busy={props.state === 'loading' || undefined}>
      <span className="request-state__icon"><Icon size={18} aria-hidden="true" /></span>
      <strong>{title}</strong>
      <p>{detail}</p>
      {props.state === 'error' && props.onRetry && <button className="text-action" onClick={props.onRetry}>Try again</button>}
    </div>
  );
}
