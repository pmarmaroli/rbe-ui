import type { ReactNode } from 'react';
export interface FilterCardProps {
    children: ReactNode;
    className?: string;
}
/** Bordered card wrapper for a row of filter controls, sitting above a list/table. */
export declare function FilterCard({ children, className }: FilterCardProps): import("react").JSX.Element;
export interface FilterGroupsProps {
    children: ReactNode;
    className?: string;
}
/** Flex-wrap row aligning several <FilterGroup>s, meant to live inside a <FilterCard>. */
export declare function FilterGroups({ children, className }: FilterGroupsProps): import("react").JSX.Element;
export interface FilterGroupProps {
    label: string;
    children: ReactNode;
    className?: string;
}
/** A single labeled filter control: small uppercase label above, the control below. */
export declare function FilterGroup({ label, children, className }: FilterGroupProps): import("react").JSX.Element;
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
export declare function SegmentedToggle({ options, value, onChange, className }: SegmentedToggleProps): import("react").JSX.Element;
