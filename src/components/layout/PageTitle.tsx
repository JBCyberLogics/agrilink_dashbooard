import type { PageDefinition } from '../../config/navigation';

export function PageTitle({ page }: { page: PageDefinition }) {
  const Icon = page.icon;
  return (
    <div className="page-title-row">
      <div className="page-title-row__icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></div>
      <div>
        <span className="eyebrow">{page.group.toUpperCase()}</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
    </div>
  );
}

