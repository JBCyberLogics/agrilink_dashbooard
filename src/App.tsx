import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldAlert,
  Sun,
  X,
} from 'lucide-react';
import logoUrl from '../images/logo.png';
import { StatusPill } from './components/ui/StatusPill';
import { DEFAULT_PAGE, NAVIGATION, PAGE_BY_PATH, PAGES, type PageDefinition } from './config/navigation';
import { AuthProvider, useAuth } from './modules/auth/context/AuthProvider';
import { ProtectedRoute } from './modules/auth/guards/ProtectedRoute';
import { AuthLoading } from './modules/auth/components/AuthLoading';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { getDevelopmentPreviewPath, getDevelopmentPreviewUrl, LOGIN_PATH } from './modules/auth/config/auth.config';

const AdminPage = lazy(() => import('./modules/admin/AdminPages'));
const DashboardPage = lazy(() => import('./modules/dashboard/DashboardPage'));
const AlgorithmPage = lazy(() => import('./modules/ai/AlgorithmPage'));

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  try {
    return window.localStorage.getItem('agrilink-control-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function PageContent({ page, navigate }: { page: PageDefinition; navigate: (path: string) => void }) {
  const module = page.kind === 'overview' || page.kind === 'analytics'
    ? <DashboardPage page={page} navigate={navigate} />
    : page.kind === 'algorithm'
      ? <AlgorithmPage page={page} />
      : <AdminPage page={page} navigate={navigate} />;
  return <Suspense fallback={<div className="route-loading" role="status"><span className="route-loading__spinner" /><span>Opening section</span></div>}>{module}</Suspense>;
}

function Sidebar({
  currentPath, collapsed, mobileOpen, onCollapse, onClose, navigate,
}: {
  currentPath: string; collapsed: boolean; mobileOpen: boolean; onCollapse: () => void; onClose: () => void; navigate: (path: string) => void;
}) {
  const activePage = PAGE_BY_PATH.get(currentPath) ?? DEFAULT_PAGE;
  const [expanded, setExpanded] = useState<string[]>([activePage.group]);
  useEffect(() => {
    if (!expanded.includes(activePage.group)) setExpanded((current) => [...current, activePage.group]);
  }, [activePage.group, expanded]);

  function toggleGroup(label: string) {
    setExpanded((current) => current.includes(label) ? current.filter((value) => value !== label) : [...current, label]);
  }

  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}${mobileOpen ? ' sidebar--mobile-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-brand">
          <img className="brand-logo" src={logoUrl} alt="AgriLink" />
          <button className="sidebar-close mobile-only" aria-label="Close navigation" onClick={onClose}><X size={18} /></button>
        </div>
        {!collapsed && <div className="workspace-label"><span>WORKSPACE</span><span className="workspace-label__indicator"><span /> Administration</span></div>}
        <nav className="sidebar-nav">
          {NAVIGATION.map((group) => {
            const open = expanded.includes(group.label) || collapsed;
            return <section className={`nav-group${open ? ' nav-group--open' : ''}`} key={group.label}>
              {!collapsed && <button className="nav-group__heading" aria-expanded={expanded.includes(group.label)} onClick={() => toggleGroup(group.label)}><span>{group.label}</span><ChevronDown size={14} aria-hidden="true" /></button>}
              {open && <div className="nav-group__items">{group.items.map((item) => {
                const Icon = item.icon;
                const selected = currentPath === item.path;
                return <button key={item.id} className={`nav-item${selected ? ' nav-item--active' : ''}`} aria-current={selected ? 'page' : undefined} aria-label={collapsed ? item.title : undefined} title={collapsed ? item.title : undefined} onClick={() => navigate(item.path)}><Icon size={17} strokeWidth={selected ? 2 : 1.8} aria-hidden="true" /><span>{item.title}</span>{selected && <span className="nav-item__indicator" />}</button>;
              })}</div>}
            </section>;
          })}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <div className="admin-access-card"><span className="admin-access-card__icon"><ShieldAlert size={16} aria-hidden="true" /></span><span><strong>Admin identity</strong><small>Not integrated</small></span><span className="admin-access-card__dot" /></div>}
          <button className="collapse-button" onClick={onCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <PanelLeftOpen size={17} /> : <><PanelLeftClose size={17} /><span>Collapse sidebar</span><ChevronLeft className="collapse-button__chevron" size={15} /></>}</button>
        </div>
      </aside>
    </>
  );
}

function AppContent() {
  const auth = useAuth();
  const [path, setPath] = useState(window.location.pathname === '/' ? LOGIN_PATH : window.location.pathname);
  const [returnPath, setReturnPath] = useState(() => PAGE_BY_PATH.has(window.location.pathname) ? window.location.pathname : DEFAULT_PAGE.path);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previewPath = import.meta.env.DEV ? getDevelopmentPreviewPath(path, true) : null;
  const isDevelopmentPreview = previewPath !== null;
  const activePath = previewPath ?? path;
  const page = PAGE_BY_PATH.get(activePath);
  const matches = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return search ? PAGES.filter((item) => `${item.title} ${item.group} ${item.description}`.toLocaleLowerCase().includes(search)).slice(0, 7) : [];
  }, [query]);

  useEffect(() => {
    if (window.location.pathname === '/') window.history.replaceState({}, '', LOGIN_PATH);
    function handlePopState() { setPath(window.location.pathname === '/' ? LOGIN_PATH : window.location.pathname); setQuery(''); setSearchOpen(false); }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isDevelopmentPreview || auth.status === 'checking') return;

    if (auth.status === 'authenticated') {
      if (path === LOGIN_PATH) {
        window.history.replaceState({}, '', returnPath);
        setPath(returnPath);
      }
      return;
    }

    if (path !== LOGIN_PATH) {
      if (PAGE_BY_PATH.has(path)) setReturnPath(path);
      window.history.replaceState({}, '', LOGIN_PATH);
      setPath(LOGIN_PATH);
    }
  }, [auth.status, isDevelopmentPreview, path, returnPath]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem('agrilink-control-theme', theme); } catch { /* Theme remains available for this session. */ }
  }, [theme]);

  useEffect(() => {
    function handleShortcuts(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setNotificationsOpen(false);
        setSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setQuery('');
      }
    }
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, []);

  function navigate(nextPath: string) {
    if (!PAGE_BY_PATH.has(nextPath)) return;
    let nextUrl = nextPath;
    if (import.meta.env.DEV && isDevelopmentPreview) nextUrl = getDevelopmentPreviewUrl(nextPath, true) ?? nextPath;
    if (nextUrl !== path) window.history.pushState({}, '', nextUrl);
    setPath(nextUrl);
    setQuery('');
    setSearchOpen(false);
    setNotificationsOpen(false);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  function toggleTheme() { setTheme((current) => current === 'light' ? 'dark' : 'light'); }

  function openDevelopmentPreview() {
    if (!import.meta.env.DEV) return;
    const previewUrl = getDevelopmentPreviewUrl(DEFAULT_PAGE.path, true);
    if (!previewUrl) return;
    window.history.pushState({}, '', previewUrl);
    setPath(previewUrl);
    setQuery('');
    setSearchOpen(false);
  }

  function exitDevelopmentPreview() {
    if (!isDevelopmentPreview) return;
    window.history.pushState({}, '', LOGIN_PATH);
    setPath(LOGIN_PATH);
    setQuery('');
    setSearchOpen(false);
    setNotificationsOpen(false);
  }

  const loginPage = (
    <LoginPage
      theme={theme}
      onToggleTheme={toggleTheme}
      onAuthenticated={() => navigate(returnPath)}
      onDevelopmentPreview={import.meta.env.DEV ? openDevelopmentPreview : undefined}
    />
  );

  const Icon = page?.icon ?? CircleHelp;
  const dashboardShell = (
    <ProtectedRoute fallback={loginPage} developmentPreview={isDevelopmentPreview}>
    <div className={`app-shell${isDevelopmentPreview ? ' app-shell--preview' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Sidebar currentPath={activePath} collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={() => setCollapsed((current) => !current)} onClose={() => setMobileOpen(false)} navigate={navigate} />
      <div className={`app-main${collapsed ? ' app-main--collapsed' : ''}`}>
        {isDevelopmentPreview && <div className="dev-preview-banner" role="status"><ShieldAlert size={14} aria-hidden="true" /><strong>Development preview</strong><span>Dashboard shown without an authenticated session</span><button type="button" onClick={exitDevelopmentPreview}>Exit preview</button></div>}
        <header className="topbar">
          <div className="topbar__leading">
            <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={19} /></button>
            <div className="breadcrumbs"><span>AgriLink Control</span><ChevronRight size={14} aria-hidden="true" /><span>{page?.group ?? 'Workspace'}</span><ChevronRight size={14} aria-hidden="true" /><strong>{page?.title ?? 'Page not found'}</strong></div>
          </div>
          <div className="topbar__actions">
            <div className={`global-search-wrap${searchOpen ? ' global-search-wrap--open' : ''}`}>
              <label className={`global-search${searchOpen ? ' global-search--focused' : ''}`} htmlFor="global-search-input"><Search size={16} aria-hidden="true" /><input ref={searchInputRef} id="global-search-input" type="search" placeholder="Search workspace" value={query} aria-expanded={searchOpen} aria-controls="search-results" onFocus={() => { setSearchOpen(true); setNotificationsOpen(false); }} onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === 'Escape') { setSearchOpen(false); setQuery(''); } if (event.key === 'Enter' && matches[0]) navigate(matches[0].path); }} /><kbd><Command size={11} aria-hidden="true" /> K</kbd></label>
              {searchOpen && <><button className="popover-scrim" aria-label="Close search results" onClick={() => setSearchOpen(false)} /><div id="search-results" className="search-popover" role="region" aria-label="Workspace results">{query.trim() ? matches.length ? matches.map((item) => { const ItemIcon = item.icon; return <button key={item.id} onClick={() => navigate(item.path)}><span className="search-result__icon"><ItemIcon size={16} aria-hidden="true" /></span><span><strong>{item.title}</strong><small>{item.group}</small></span><ArrowRight size={15} aria-hidden="true" /></button>; }) : <div className="search-empty">No sections match “{query}”.</div> : <div className="search-hint"><Command size={14} /> Search any administration section</div>}</div></>}
            </div>
            <div className="topbar-divider" />
            <div className="service-state" title="No admin API contract is configured in this application"><span className="service-state__dot" /><span>API not connected</span></div>
            <div className="topbar-divider topbar-divider--subtle" />
            <div className="notification-wrap">
              <button className={`icon-button notification-button${notificationsOpen ? ' is-active' : ''}`} aria-label="Open notifications (unavailable)" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((current) => !current); setSearchOpen(false); }}><Bell size={18} /></button>
              {notificationsOpen && <div className="notification-popover"><div className="notification-popover__head"><strong>Notifications</strong><StatusPill>Unavailable</StatusPill></div><div className="notification-popover__empty"><Bell size={20} /><strong>Notification service not connected</strong><span>No alert endpoint is configured.</span></div></div>}
            </div>
            <button className="icon-button theme-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} onClick={toggleTheme}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            {auth.status === 'authenticated'
              ? <button className="identity-state identity-state--button" type="button" aria-label="Admin logout" title={`End ${auth.session?.administrator.displayName ?? 'administrator'} session`} onClick={() => { void auth.logout(); }}><span>Admin logout</span><LogOut size={14} aria-hidden="true" /></button>
              : isDevelopmentPreview
                ? <button className="identity-state identity-state--button identity-state--preview" type="button" aria-label="Admin logout" title="No administrator session is active in the development preview" disabled><span>Admin logout</span><LogOut size={14} aria-hidden="true" /></button>
              : <div className="identity-state" title="Administrator identity has not been integrated"><ShieldAlert size={15} aria-hidden="true" /><span>Identity not connected</span></div>}
          </div>
        </header>
        <main id="main-content" className="main-content" tabIndex={-1}>
          {page ? <PageContent page={page} navigate={navigate} /> : <div className="page-stack"><div className="not-found panel"><span className="not-found__icon"><Icon size={22} /></span><span className="eyebrow">UNKNOWN ROUTE</span><h1>This section isn’t in the workspace.</h1><p>Open a section from the navigation to continue.</p><button className="button button--primary" onClick={() => navigate(DEFAULT_PAGE.path)}>Go to dashboard <ArrowRight size={16} /></button></div></div>}
          <footer className="app-footer"><span><img className="footer-logo" src={logoUrl} alt="AgriLink Control" /></span><span>Independent administration workspace</span><button onClick={() => navigate('/settings/general')}>Integration requirements <ExternalLink size={13} aria-hidden="true" /></button></footer>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
  const showSessionCheck = !isDevelopmentPreview && (auth.status === 'checking' || (auth.status === 'authenticated' && path === LOGIN_PATH));
  const showLogin = !showSessionCheck && (path === LOGIN_PATH || (!isDevelopmentPreview && auth.status !== 'authenticated'));

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        {showSessionCheck
          ? <motion.div key="session-check" className="auth-route-transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AuthLoading /></motion.div>
          : showLogin
          ? <motion.div key="login" className="auth-route-transition" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: 'easeOut' }}>{loginPage}</motion.div>
          : <motion.div key={isDevelopmentPreview ? 'development-preview' : 'dashboard'} className="dashboard-route-transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24, ease: 'easeOut' }}>{dashboardShell}</motion.div>}
      </AnimatePresence>
    </MotionConfig>
  );
}

function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}

export default App;
