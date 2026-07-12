import type { ReactNode } from 'react';
export interface StatCardsProps {
    children: ReactNode;
    className?: string;
}
/** Responsive grid of <StatCard>s. */
export declare function StatCards({ children, className }: StatCardsProps): import("react").JSX.Element;
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
export declare function StatCard({ value, label, valueColor, icon, sub, className }: StatCardProps): import("react").JSX.Element;
