import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  Cpu,
  Database,
  FileBarChart,
  FileText,
  Handshake,
  HeartPulse,
  LayoutDashboard,
  Leaf,
  ListChecks,
  MapPin,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  Radio,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  UserCog,
  Users,
  WalletCards,
} from 'lucide-react';

export type PageId =
  | 'dashboard' | 'analytics' | 'alerts'
  | 'users' | 'farmers' | 'buyers' | 'verifications' | 'administrators' | 'roles'
  | 'listings' | 'categories' | 'markets' | 'transactions' | 'disputes'
  | 'ai-control' | 'nvidia' | 'models' | 'agent-studio' | 'capabilities' | 'algorithms'
  | 'market-intelligence' | 'data-sources' | 'ai-diagnostics' | 'ai-usage'
  | 'support' | 'announcements' | 'reports' | 'audit-logs' | 'system-health'
  | 'general-settings' | 'security-settings' | 'marketplace-settings' | 'notification-settings';

export type PageDefinition = {
  id: PageId;
  path: string;
  title: string;
  description: string;
  icon: LucideIcon;
  group: string;
  kind: 'overview' | 'analytics' | 'resource' | 'roles' | 'ai' | 'provider' | 'capabilities' | 'algorithm' | 'health' | 'settings';
};

export type NavigationGroup = {
  label: string;
  items: PageDefinition[];
};

const pages: PageDefinition[] = [
  { id: 'dashboard', path: '/dashboard', title: 'Dashboard', description: 'A clear view of platform operations and integration readiness.', icon: LayoutDashboard, group: 'Overview', kind: 'overview' },
  { id: 'analytics', path: '/analytics', title: 'Platform analytics', description: 'User, marketplace, transaction, and service trends from verified backend data.', icon: ChartNoAxesCombined, group: 'Overview', kind: 'analytics' },
  { id: 'alerts', path: '/alerts', title: 'Notifications & alerts', description: 'Operational alerts and notifications returned by AgriLink services.', icon: Bell, group: 'Overview', kind: 'resource' },
  { id: 'users', path: '/users', title: 'All users', description: 'Search and review platform accounts with server-enforced permissions.', icon: Users, group: 'People', kind: 'resource' },
  { id: 'farmers', path: '/farmers', title: 'Farmers', description: 'Farmer profiles, farm information, produce, and verification records.', icon: Sprout, group: 'People', kind: 'resource' },
  { id: 'buyers', path: '/buyers', title: 'Buyers', description: 'Buyer profiles, business details, sourcing needs, and account status.', icon: ShoppingBag, group: 'People', kind: 'resource' },
  { id: 'verifications', path: '/verifications', title: 'Verification & approvals', description: 'Review and record authorized verification decisions.', icon: ClipboardCheck, group: 'People', kind: 'resource' },
  { id: 'administrators', path: '/administrators', title: 'Administrator accounts', description: 'Privileged accounts and administrative access.', icon: UserCog, group: 'People', kind: 'resource' },
  { id: 'roles', path: '/roles', title: 'Roles & permissions', description: 'Review the proposed role catalogue and server-side access boundary.', icon: ShieldCheck, group: 'People', kind: 'roles' },
  { id: 'listings', path: '/marketplace/listings', title: 'All listings', description: 'Produce listings and their moderation state.', icon: PackageCheck, group: 'Marketplace', kind: 'resource' },
  { id: 'categories', path: '/marketplace/categories', title: 'Produce categories', description: 'Marketplace produce categories and their configuration.', icon: Leaf, group: 'Marketplace', kind: 'resource' },
  { id: 'markets', path: '/marketplace/markets', title: 'Markets & locations', description: 'Market coverage and geographic configuration.', icon: MapPin, group: 'Marketplace', kind: 'resource' },
  { id: 'transactions', path: '/marketplace/transactions', title: 'Orders & transactions', description: 'Traceable marketplace orders and financial records.', icon: WalletCards, group: 'Marketplace', kind: 'resource' },
  { id: 'disputes', path: '/marketplace/disputes', title: 'Reports & disputes', description: 'Reported content, buyer–seller disputes, and resolution history.', icon: Handshake, group: 'Marketplace', kind: 'resource' },
  { id: 'ai-control', path: '/ai/control-centre', title: 'AI control centre', description: 'One operational view of AgriLink intelligence services.', icon: BrainCircuit, group: 'AI & intelligence', kind: 'ai' },
  { id: 'nvidia', path: '/ai/nvidia', title: 'NVIDIA configuration', description: 'Backend-managed provider settings and genuine connection diagnostics.', icon: Cpu, group: 'AI & intelligence', kind: 'provider' },
  { id: 'models', path: '/ai/models', title: 'Model registry', description: 'Provider-reported models, capabilities, and assignment state.', icon: Boxes, group: 'AI & intelligence', kind: 'resource' },
  { id: 'agent-studio', path: '/ai/agent-studio', title: 'AI agent studio', description: 'The central agent, its routes, tools, permissions, and version history.', icon: Bot, group: 'AI & intelligence', kind: 'ai' },
  { id: 'capabilities', path: '/ai/capabilities', title: 'AI capabilities', description: 'The twelve requested AgriLink AI capabilities and their verification state.', icon: ListChecks, group: 'AI & intelligence', kind: 'capabilities' },
  { id: 'algorithms', path: '/ai/algorithms', title: 'Smart algorithm studio', description: 'Deterministic, explainable scoring and calculation tools.', icon: SlidersHorizontal, group: 'AI & intelligence', kind: 'algorithm' },
  { id: 'market-intelligence', path: '/market-intelligence', title: 'Market intelligence', description: 'Verified agricultural observations, freshness, and data quality.', icon: BarChart3, group: 'AI & intelligence', kind: 'resource' },
  { id: 'data-sources', path: '/market-intelligence/data-sources', title: 'Data sources', description: 'Authorized provider configuration and ingestion status.', icon: Database, group: 'AI & intelligence', kind: 'resource' },
  { id: 'ai-diagnostics', path: '/ai/diagnostics', title: 'AI diagnostics', description: 'Real provider, gateway, agent, algorithm, and source checks.', icon: Activity, group: 'AI & intelligence', kind: 'health' },
  { id: 'ai-usage', path: '/ai/usage', title: 'AI usage & monitoring', description: 'Usage and performance from genuine backend telemetry.', icon: FileBarChart, group: 'AI & intelligence', kind: 'analytics' },
  { id: 'support', path: '/support', title: 'Support & messages', description: 'Support requests, assignment, and response history.', icon: MessageSquareText, group: 'Operations', kind: 'resource' },
  { id: 'announcements', path: '/announcements', title: 'Announcements', description: 'Role-targeted platform communications and publishing state.', icon: Megaphone, group: 'Operations', kind: 'resource' },
  { id: 'reports', path: '/reports', title: 'Reports & exports', description: 'Authorized reports generated from genuine records.', icon: FileText, group: 'Operations', kind: 'resource' },
  { id: 'audit-logs', path: '/audit-logs', title: 'Audit logs', description: 'Append-only administrative activity from the shared backend.', icon: ScrollText, group: 'Operations', kind: 'resource' },
  { id: 'system-health', path: '/system-health', title: 'System health', description: 'Health information reported by platform services.', icon: HeartPulse, group: 'Operations', kind: 'health' },
  { id: 'general-settings', path: '/settings/general', title: 'General settings', description: 'Platform-wide settings supported by authorized backend services.', icon: Settings, group: 'Configuration', kind: 'settings' },
  { id: 'security-settings', path: '/settings/security', title: 'Security settings', description: 'Backend-controlled identity, session, and security policies.', icon: ShieldCheck, group: 'Configuration', kind: 'settings' },
  { id: 'marketplace-settings', path: '/settings/marketplace', title: 'Marketplace settings', description: 'Marketplace policies, listing rules, and supported locations.', icon: ShoppingCart, group: 'Configuration', kind: 'settings' },
  { id: 'notification-settings', path: '/settings/notifications', title: 'Notification settings', description: 'Delivery channels, templates, and notification rules.', icon: Radio, group: 'Configuration', kind: 'settings' },
];

const groups = ['Overview', 'People', 'Marketplace', 'AI & intelligence', 'Operations', 'Configuration'];

export const PAGES = pages;
export const NAVIGATION: NavigationGroup[] = groups.map((label) => ({
  label,
  items: pages.filter((page) => page.group === label),
}));
export const PAGE_BY_PATH = new Map(pages.map((page) => [page.path, page]));
export const DEFAULT_PAGE = pages[0]!;

export const SYSTEMS = [
  'Backend API',
  'Authentication & RBAC',
  'AI gateway',
  'Central AI agent',
  'NVIDIA provider',
  'Market data ingestion',
  'Notifications',
  'File storage',
];

export const AI_CAPABILITIES = [
  { name: 'Agricultural Assistant', audience: 'Shared' },
  { name: 'AI Market Advisor', audience: 'Shared' },
  { name: 'Recommendations Center', audience: 'Shared' },
  { name: 'AI Crop Advisor', audience: 'Farmer' },
  { name: 'AI Price Advisor', audience: 'Farmer' },
  { name: 'AI Listing Assistant', audience: 'Farmer' },
  { name: 'AI Matching Assistant', audience: 'Farmer' },
  { name: 'AI Harvest Advisor', audience: 'Farmer' },
  { name: 'AI Net Profit Advisor', audience: 'Farmer' },
  { name: 'AI Produce Finder', audience: 'Buyer' },
  { name: 'AI Supplier Advisor', audience: 'Buyer' },
  { name: 'AI Purchase Assistant', audience: 'Buyer' },
];

export const PROPOSED_ROLES = [
  { name: 'Super Admin', note: 'Full administration; requires strong MFA and server-side approval.' },
  { name: 'Operations Admin', note: 'Marketplace operations, moderation, and platform support.' },
  { name: 'AI Admin', note: 'AI providers, models, agent configuration, and algorithm publishing.' },
  { name: 'Support Admin', note: 'Support requests and user assistance workflows.' },
  { name: 'Data Admin', note: 'Data sources, market intelligence, reports, and quality review.' },
  { name: 'Read-only Admin', note: 'Read-only access to explicitly permitted administrative data.' },
];

export const SYSTEM_ICON: LucideIcon = Building2;
