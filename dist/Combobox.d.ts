import type { InputHTMLAttributes } from 'react';
export interface ComboboxOption {
    value: string;
    label: string;
}
export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    /** Shown as the input's empty-state text. Also doubles as the "clear selection" option's label when allowClear is true. */
    placeholder?: string;
    /** Whether an "All"/clear option (value '') is offered. Default true — set false for a required field. */
    allowClear?: boolean;
    /** Cap on rendered options after filtering, so a list of thousands stays fast and scrollable-in-practice. Default 200. */
    maxResults?: number;
    className?: string;
}
/**
 * A single control that both filters by typed text AND lets you just open and
 * pick, so a list of a handful of items and a list of thousands both stay
 * usable — scrolling a plain <select> with thousands of entries isn't a real
 * option, but forcing everyone to type isn't either.
 */
export declare function Combobox({ options, value, onChange, placeholder, allowClear, maxResults, className, ...rest }: ComboboxProps): import("react").JSX.Element;
