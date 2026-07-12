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
    className?: string;
}
/** Flat KPI card: a big number/value on top, a small uppercase label below. */
export declare function StatCard({ value, label, valueColor, className }: StatCardProps): import("react").JSX.Element;
