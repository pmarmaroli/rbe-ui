import type { ReactNode } from 'react';
import { ensureFilterCardStyles } from './filterCardStyles';

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FilterCardProps {
  children: ReactNode;
  className?: string;
}

/** Bordered card wrapper for a row of filter controls, sitting above a list/table. */
export function FilterCard({ children, className }: FilterCardProps) {
  ensureFilterCardStyles();
  return <div className={cx('rbe-filter-card', className)}>{children}</div>;
}

export interface FilterGroupsProps {
  children: ReactNode;
  className?: string;
}

/** Flex-wrap row aligning several <FilterGroup>s, meant to live inside a <FilterCard>. */
export function FilterGroups({ children, className }: FilterGroupsProps) {
  ensureFilterCardStyles();
  return <div className={cx('rbe-filter-groups', className)}>{children}</div>;
}

export interface FilterGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** A single labeled filter control: small uppercase label above, the control below. */
export function FilterGroup({ label, children, className }: FilterGroupProps) {
  ensureFilterCardStyles();
  return (
    <div className={cx('rbe-filter-group', className)}>
      <div className="rbe-filter-group-label">{label}</div>
      {children}
    </div>
  );
}

export interface SegmentedToggleOption {
  value: string;
  label: string;
}

export interface SegmentedToggleProps {
  options: SegmentedToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Pill-group toggle (e.g. "Project / Zone / All projects", "Month / Year"). */
export function SegmentedToggle({ options, value, onChange, className }: SegmentedToggleProps) {
  ensureFilterCardStyles();
  return (
    <div className={cx('rbe-segmented-toggle', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={cx('rbe-segmented-toggle-btn', value === o.value && 'rbe-segmented-toggle-btn--active')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
