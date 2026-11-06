import { Activity, ArrowRight, BrainCircuit, Database, FileSearch, Leaf, MapPin, ShieldAlert, ShoppingBag, Sprout, Users } from 'lucide-react';
import type { PageDefinition } from '../../config/navigation';
import { BackendNotice } from '../../components/feedback/BackendNotice';
import { ReadinessLine } from '../../components/feedback/ReadinessLine';
import { PageTitle } from '../../components/layout/PageTitle';
import { SectionHeading } from '../../components/ui/StatusPill';

export function OverviewPage({ navigate }: { navigate: (path: string) => void }) {
  const metrics = [
    { label: 'Total users', caption: 'Farmers and buyers', icon: Leaf },
    { label: 'Farmers', caption: 'Registered farmer accounts', icon: Sprout },
    { label: 'Buyers', caption: 'Registered buyer accounts', icon: ShoppingBag },
    { label: 'Active listings', caption: 'Currently published', icon: Activity },
    { label: 'Transactions', caption: 'Marketplace activity', icon: Database },
    { label: 'Pending verification', caption: 'Awaiting review', icon: ShieldAlert },
    { label: 'AI service availability', caption: 'Diagnostic not run', icon: BrainCircuit },
    { label: 'Market data availability', caption: 'Provider not verified', icon: MapPin },
  ];

  return (
    <div className="page-stack">
      <div className="overview-intro">
        <div>
          <span className="eyebrow">OPERATIONS OVERVIEW</span>
          <h2>Control the work that<br className="desktop-break" /> keeps AgriLink moving.</h2>
          <p>Your administration workspace is ready. Connect the shared backend to bring verified platform activity into view.</p>
        </div>
        <div className="overview-intro__mark" aria-hidden="true"><Leaf size={74} strokeWidth={1.15} /></div>
      </div>

      <BackendNotice />

      <section className="metric-grid" aria-label="Platform metrics">
        {metrics.map(({ label, caption, icon: Icon }) => (
          <article className="metric-card" key={label}>
            <div className="metric-card__top"><span className="metric-card__icon"><Icon size={17} aria-hidden="true" /></span><span className="metric-card__unit">Not loaded</span></div>
            <div className="metric-card__value" aria-label={`${label}: unavailable`}>—</div>
            <div className="metric-card__label">{label}</div>
            <div className="metric-card__caption">{caption}</div>
          </article>
        ))}
      </section>

      <div className="overview-grid">
        <section className="panel panel--readiness">
          <SectionHeading eyebrow="SERVICE READINESS" title="Signals & health" detail="Statuses require evidence from a real service response." action={<span className="panel-meta"><span className="panel-meta__ring" /> Live checks not run</span>} />
          <div className="readiness-list">
            <ReadinessLine icon={ShieldAlert} title="Admin identity" detail="Authentication and server-side RBAC" />
            <ReadinessLine icon={BrainCircuit} title="AI gateway" detail="Provider and central agent routing" />
            <ReadinessLine icon={Database} title="Market data" detail="Verified source and ingestion telemetry" />
          </div>
          <button className="text-action" onClick={() => navigate('/system-health')}>Open system health <ArrowRight size={15} aria-hidden="true" /></button>
        </section>

        <section className="panel panel--activity">
          <SectionHeading eyebrow="ACTIVITY" title="Recent activity" detail="Administrative events from the shared audit service." />
          <div className="empty-activity">
            <span className="empty-activity__icon"><FileSearch size={21} aria-hidden="true" /></span>
            <strong>Activity is unavailable</strong>
            <p>No audit log endpoint is connected, so there are no verified events to display.</p>
            <button className="text-action" onClick={() => navigate('/audit-logs')}>Review audit log requirements <ArrowRight size={15} aria-hidden="true" /></button>
          </div>
        </section>
      </div>

      <section className="panel next-steps-panel">
        <div className="next-steps-panel__copy">
          <span className="eyebrow">INTEGRATION CHECKLIST</span>
          <h2>Start with the contracts this workspace needs.</h2>
          <p>Identity, permissions, resource APIs, and service diagnostics are the first server-side dependencies.</p>
        </div>
        <button className="button button--secondary" onClick={() => navigate('/settings/general')}>View requirements <ArrowRight size={16} aria-hidden="true" /></button>
      </section>
    </div>
  );
}

export function AnalyticsPage({ page }: { page: PageDefinition }) {
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel analytics-empty">
        <div className="analytics-empty__art" aria-hidden="true"><div className="analytics-empty__axis"><span /><span /><span /><span /></div><div className="analytics-empty__bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
        <span className="eyebrow">WAITING FOR VERIFIED DATA</span>
        <h2>Analytics appear when there is a trusted source.</h2>
        <p>No charts are drawn until the backend returns validated observations with units, timestamps, and a reporting range.</p>
      </section>
      <div className="two-column-grid">
        <section className="panel"><SectionHeading title="Analytics sources" detail="Each source needs an explicit backend contract." /><div className="readiness-list"><ReadinessLine icon={Users} title="User growth" detail="Registration and role aggregates" status="Unavailable" /><ReadinessLine icon={ShoppingBag} title="Marketplace activity" detail="Listings, orders, and transactions" status="Unavailable" /></div></section>
        <section className="panel"><SectionHeading title="Telemetry sources" detail="No simulated series or values are shown." /><div className="readiness-list"><ReadinessLine icon={BrainCircuit} title="AI usage" detail="Requests, errors, latency, and token usage" status="Unavailable" /><ReadinessLine icon={MapPin} title="Geographic coverage" detail="Aggregated user and market locations" status="Unavailable" /></div></section>
      </div>
    </div>
  );
}

export default function DashboardPage({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  if (page.kind === 'overview') return <OverviewPage navigate={navigate} />;
  if (page.kind === 'analytics') return <AnalyticsPage page={page} />;
  return null;
}

