import type { ReactNode } from "react";

export function DemoBadge({ children = "Demonstration data" }: { children?: ReactNode }) {
  return (
    <span className="demo-badge">
      <span aria-hidden="true">◆</span> {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  children,
  badge,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <div className="section-title-row">
        <h1 tabIndex={-1} id="section-title">
          {title}
        </h1>
        {badge}
      </div>
      {children && <div className="section-intro">{children}</div>}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "blue" | "green" | "cyan" | "amber";
}) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
  aside,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={`panel ${className}`} aria-label={title}>
      {(title || aside) && (
        <div className="panel-head">
          {title && <h2>{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
