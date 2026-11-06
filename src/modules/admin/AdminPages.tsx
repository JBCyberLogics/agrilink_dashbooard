import { Activity, ArrowRight, BookOpenCheck, Bot, BrainCircuit, Check, Clock3, Cpu, Database, ShieldAlert, type LucideIcon } from 'lucide-react';
import { AI_CAPABILITIES, PROPOSED_ROLES, SYSTEMS, type PageDefinition } from '../../config/navigation';
import { RequestState } from '../../components/feedback/RequestState';
import { BackendNotice } from '../../components/feedback/BackendNotice';
import { PageTitle } from '../../components/layout/PageTitle';
import { SectionHeading, StatusPill } from '../../components/ui/StatusPill';

const RESOURCE_FIELDS: Partial<Record<PageDefinition['id'], string[]>> = {
  users: ['User ID', 'Name', 'Account type', 'Verification', 'Status'],
  farmers: ['Farmer ID', 'Farm', 'Location', 'Produce', 'Verification'],
  buyers: ['Buyer ID', 'Business', 'Sourcing area', 'Interests', 'Status'],
  verifications: ['Request ID', 'Account', 'Submitted', 'Documents', 'Decision'],
  administrators: ['Admin ID', 'Account', 'Role', 'MFA', 'Status'],
  listings: ['Listing ID', 'Produce', 'Seller', 'Availability', 'Moderation'],
  categories: ['Category ID', 'Name', 'Visibility', 'Updated'],
  markets: ['Market ID', 'Name', 'Location', 'Coverage', 'Status'],
  transactions: ['Reference', 'Order', 'Buyer / seller', 'Amount', 'Status'],
  disputes: ['Case ID', 'Type', 'Parties', 'Opened', 'Status'],
  models: ['Model', 'Provider', 'Capability', 'Assignment', 'Last verified'],
  'market-intelligence': ['Observation', 'Provider', 'Market', 'Observed at', 'Quality'],
  'data-sources': ['Provider', 'Coverage', 'Freshness', 'Last ingestion', 'Status'],
  support: ['Request', 'Category', 'Priority', 'Assignee', 'Status'],
  announcements: ['Announcement', 'Audience', 'Publish time', 'Author', 'Status'],
  reports: ['Report', 'Scope', 'Requested by', 'Created', 'Status'],
  'audit-logs': ['Administrator', 'Action', 'Resource', 'Timestamp', 'Result'],
  alerts: ['Alert', 'Service', 'Severity', 'First seen', 'Status'],
};

const RESOURCE_OPERATIONS: Partial<Record<PageDefinition['id'], string[]>> = {
  users: ['Authorized account listing and detail', 'Search, filters, sorting, and pagination', 'Role-checked status and verification changes', 'Append-only audit event for every privileged action'],
  farmers: ['Farmer and farm profile read/update', 'Listings, transaction, and verification relationships', 'Scoped administrative notes, if supported'],
  buyers: ['Buyer and business profile read/update', 'Sourcing preferences and transaction relationships', 'Scoped administrative notes, if supported'],
  verifications: ['Review documents through secure, authorized access', 'Approve, reject, or request information with reasons', 'Immutable decision history and operator attribution'],
  administrators: ['Privileged identity and MFA state', 'Role assignment guarded by backend policy', 'Session revocation and audited account changes'],
  listings: ['Listing read and moderation queue', 'Approve, reject, unpublish, archive, or remove by policy', 'Reason capture and audit trail'],
  transactions: ['Traceable order and payment records', 'Reconciliation and status history', 'No unrestricted deletion of financial records'],
  'audit-logs': ['Append-only audit query with filters and pagination', 'Actor, resource, result, and timestamp', 'Sensitive before/after fields only where authorized'],
  'data-sources': ['Backend-stored provider configuration', 'Genuine ingestion status, freshness, and quality', 'Secret masking and server-side connection diagnostics'],
};

function ResourcePage({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  const fields = RESOURCE_FIELDS[page.id] ?? ['Record', 'Type', 'Owner', 'Updated', 'Status'];
  const operations = RESOURCE_OPERATIONS[page.id] ?? ['Authorized record listing and detail', 'Server-side pagination, filters, and sorting', 'Role-checked changes and audit history'];
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel resource-panel">
        <div className="resource-panel__top">
          <div><span className="eyebrow">LIVE RECORDS</span><h2>{page.title}</h2><p>Records cannot be requested until an authorized resource contract is registered.</p></div>
          <StatusPill tone="blocked">Unavailable</StatusPill>
        </div>
        <div className="table-frame" role="region" aria-label={`${page.title} data requirements`} tabIndex={0}>
          <table><thead><tr>{fields.map((field) => <th scope="col" key={field}>{field}</th>)}</tr></thead>
            <tbody><tr><td colSpan={fields.length}><RequestState state="unavailable" title="No records loaded" detail="This view has not received data. It does not imply that the underlying resource is empty." /></td></tr></tbody>
          </table>
        </div>
        <div className="resource-panel__bottom"><span><Clock3 size={14} aria-hidden="true" /> Last request: none</span><button className="text-action" onClick={() => navigate('/settings/general')}>Review integration requirements <ArrowRight size={15} aria-hidden="true" /></button></div>
      </section>
      <section className="panel"><SectionHeading eyebrow="BACKEND DEPENDENCIES" title="Required operations" detail="These are capability requirements, not existing endpoint names." /><div className="dependency-list">{operations.map((operation) => <div key={operation}><span className="dependency-list__check"><Check size={14} aria-hidden="true" /></span>{operation}</div>)}</div></section>
    </div>
  );
}

function RolesPage({ page }: { page: PageDefinition }) {
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel">
        <div className="resource-panel__top"><div><span className="eyebrow">PROPOSED ROLE CATALOGUE</span><h2>Role boundaries</h2><p>Suggested roles from the product brief. No assignments or permissions have been loaded.</p></div><StatusPill>Not loaded</StatusPill></div>
        <div className="table-frame" role="region" aria-label="Proposed administrative roles" tabIndex={0}><table><thead><tr><th scope="col">Role</th><th scope="col">Intended scope</th><th scope="col">Source</th></tr></thead><tbody>{PROPOSED_ROLES.map((role) => <tr key={role.name}><td><strong>{role.name}</strong></td><td>{role.note}</td><td><span className="text-muted">Product proposal</span></td></tr>)}</tbody></table></div>
        <p className="panel-footnote"><ShieldAlert size={15} aria-hidden="true" /> This catalogue is a proposal, not an active permission matrix. The backend must enforce all permissions.</p>
      </section>
    </div>
  );
}

function AIPage({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  const isAgent = page.id === 'agent-studio';
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="ai-hero panel">
        <div className="ai-hero__symbol"><BrainCircuit size={23} aria-hidden="true" /></div>
        <div className="ai-hero__copy"><span className="eyebrow">{isAgent ? 'CENTRAL ORCHESTRATION' : 'INTELLIGENCE OPERATIONS'}</span><h2>{isAgent ? 'Coordinate capability with explicit guardrails.' : 'One control surface for AgriLink intelligence.'}</h2><p>{isAgent ? 'The central agent should route requests across approved capabilities while respecting user data permissions. Privileged administrative actions remain human-authorized.' : 'Connect the provider, gateway, agent, algorithms, and verified market sources through their authorized backend services.'}</p></div>
        <StatusPill>Not tested</StatusPill>
      </section>
      <div className="three-column-grid">
        <OperationalCard icon={Cpu} title="Provider" detail="NVIDIA configuration and genuine model availability." status="Not tested" />
        <OperationalCard icon={Bot} title="Central agent" detail="Routing, tools, permissions, and execution history." status="Not tested" />
        <OperationalCard icon={Database} title="Verified data" detail="Marketplace and market observations with provenance." status="Not tested" />
      </div>
      <section className="panel panel--capability-link"><div><span className="eyebrow">CAPABILITY DIRECTORY</span><h2>Keep every feature status evidence-based.</h2><p>See the twelve requested capabilities and the dependencies needed to verify them.</p></div><button className="button button--secondary" onClick={() => navigate('/ai/capabilities')}>Open capabilities <ArrowRight size={16} aria-hidden="true" /></button></section>
      <section className="panel"><SectionHeading eyebrow="SECURITY BOUNDARY" title="Human approval stays in the loop" detail="Sensitive operations require backend authorization and an auditable decision." /><div className="guardrail-grid"><span><ShieldAlert size={16} /> No silent account changes</span><span><ShieldAlert size={16} /> No transaction reversals by agent</span><span><ShieldAlert size={16} /> No permission changes by agent</span></div></section>
    </div>
  );
}

function OperationalCard({ icon: Icon, title, detail, status }: { icon: LucideIcon; title: string; detail: string; status: string }) {
  return <article className="operational-card"><div className="operational-card__head"><span className="operational-card__icon"><Icon size={17} aria-hidden="true" /></span><StatusPill>{status}</StatusPill></div><h3>{title}</h3><p>{detail}</p></article>;
}

function ProviderPage({ page }: { page: PageDefinition }) {
  const isNvidia = page.id === 'nvidia';
  const values = isNvidia
    ? ['API base URL', 'API key (masked; backend only)', 'Default model and capability assignments', 'Timeout and retry policy', 'Request parameters and token limits', 'Configuration and rotation history']
    : ['Provider identity and coverage', 'Credential reference (backend only)', 'Geographic and produce coverage', 'Data freshness and quality thresholds', 'Ingestion schedule and history'];
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel provider-panel">
        <div className="provider-panel__intro"><div className="provider-panel__mark">{isNvidia ? <Cpu size={22} aria-hidden="true" /> : <Database size={22} aria-hidden="true" />}</div><div><span className="eyebrow">SERVER-SIDE CONFIGURATION</span><h2>{isNvidia ? 'NVIDIA provider' : 'Market data provider'}</h2><p>Configuration values and secrets must be owned by a backend service. This browser has not received configuration or a connection test.</p></div><StatusPill>Not tested</StatusPill></div>
        <div className="provider-fields">{values.map((value) => <div className="provider-field" key={value}><span className="provider-field__lock"><ShieldAlert size={15} aria-hidden="true" /></span><span>{value}</span><span className="provider-field__state">Backend contract required</span></div>)}</div>
        <div className="security-callout"><ShieldAlert size={17} aria-hidden="true" /><p><strong>No secret is requested or stored in this browser.</strong> Connection tests, key rotation, and configuration writes must run through authenticated backend operations.</p></div>
      </section>
    </div>
  );
}

function CapabilitiesPage({ page }: { page: PageDefinition }) {
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel capability-panel">
        <SectionHeading eyebrow="TARGET CAPABILITY CATALOGUE" title="Twelve requested AI capabilities" detail="Names and audiences come from the product requirements; every runtime status remains unverified." action={<StatusPill>Not tested</StatusPill>} />
        <div className="capability-list">{AI_CAPABILITIES.map((capability, index) => <article className="capability-row" key={capability.name}><span className="capability-row__number">{String(index + 1).padStart(2, '0')}</span><div className="capability-row__name"><strong>{capability.name}</strong><span>{capability.audience} capability</span></div><span className="capability-row__model">Model assignment <em>Not loaded</em></span><StatusPill>Not tested</StatusPill></article>)}</div>
      </section>
    </div>
  );
}

function HealthPage({ page }: { page: PageDefinition }) {
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel health-panel"><SectionHeading eyebrow="SERVICE TELEMETRY" title="Service checks have not run" detail="The workspace will only show a health state after a genuine backend diagnostic response." action={<StatusPill>Not tested</StatusPill>} /><div className="health-grid">{SYSTEMS.map((system) => <article className="health-tile" key={system}><span className="health-tile__icon"><Activity size={17} aria-hidden="true" /></span><strong>{system}</strong><StatusPill>Not tested</StatusPill><span className="health-tile__message">No diagnostic result received</span></article>)}</div></section>
    </div>
  );
}

function SettingsPage({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  const items = page.id === 'security-settings'
    ? ['Server-side admin authentication', 'MFA enforcement for privileged roles', 'Secure session lifecycle and revocation', 'Rate limiting and CSRF policy', 'Backend RBAC and audit requirements']
    : page.id === 'marketplace-settings'
      ? ['Produce categories and location catalogue', 'Listing approval and moderation rules', 'Marketplace policies and limits', 'Order and dispute handling rules']
      : page.id === 'notification-settings'
        ? ['Supported delivery channels', 'Message templates and localization', 'Role-targeted notification rules', 'Delivery and failure telemetry']
        : ['Platform identity and branding', 'Registration and account policy', 'Supported counties and locations', 'Verification and marketplace policy', 'AI availability and market data settings'];
  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="panel settings-panel"><SectionHeading eyebrow="CONFIGURATION CONTRACT" title="Settings are not applied locally" detail="Every change must be validated and confirmed by an authorized backend service." action={<StatusPill tone="blocked">Unavailable</StatusPill>} /><div className="settings-checklist">{items.map((item) => <div className="settings-row" key={item}><span className="settings-row__icon"><BookOpenCheck size={16} aria-hidden="true" /></span><span><strong>{item}</strong><small>Requires a documented, permission-checked server operation</small></span><StatusPill>Not loaded</StatusPill></div>)}</div><div className="settings-footer"><span>Current environment template includes a backend base URL; no resource or identity contracts are documented.</span><button className="text-action" onClick={() => navigate('/dashboard')}>Back to overview <ArrowRight size={15} aria-hidden="true" /></button></div></section>
    </div>
  );
}


export default function AdminPage({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  switch (page.kind) {
    case 'resource': return <ResourcePage page={page} navigate={navigate} />;
    case 'roles': return <RolesPage page={page} />;
    case 'ai': return <AIPage page={page} navigate={navigate} />;
    case 'provider': return <ProviderPage page={page} />;
    case 'capabilities': return <CapabilitiesPage page={page} />;
    case 'health': return <HealthPage page={page} />;
    case 'settings': return <SettingsPage page={page} navigate={navigate} />;
    default: return null;
  }
}
