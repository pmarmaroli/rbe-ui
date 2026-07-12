import type { ReactNode } from 'react';
import { ensureStatCardStyles } from './statCardStyles';

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface StatCardsProps {
  children: ReactNode;
  className?: string;
}

/** Responsive grid of <StatCard>s. */
export function StatCards({ children, className }: StatCardsProps) {
  ensureStatCardStyles();
  return <div className={cx('rbe-stat-cards', className)}>{children}</div>;
}

export interface StatCardProps {
  value: ReactNode;
  label: string;
  /** Overrides the default value color (e.g. to color-code by status). */
  valueColor?: string;
  /** Optional glyph/emoji pinned to the bottom of the card. */
  icon?: ReactNode;
  /** Optional small caption below the label (e.g. "present personnel"). */
  sub?: ReactNode;
  className?: string;
}

/** Flat KPI card: a big number/value on top, a small uppercase label below, an optional sub-caption, and an optional icon at the bottom. */
export function StatCard({ value, label, valueColor, icon, sub, className }: StatCardProps) {
  ensureStatCardStyles();
  return (
    <div className={cx('rbe-stat-card', className)}>
      <div className="rbe-stat-card-value" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
      <div className="rbe-stat-card-label">{label}</div>
      {sub != null && <div className="rbe-stat-card-sub">{sub}</div>}
      {icon != null && <div className="rbe-stat-card-icon">{icon}</div>}
    </div>
  );
}
