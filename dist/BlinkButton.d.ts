import type { ButtonHTMLAttributes } from 'react';
export interface BlinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Pulses the button (blue→amber color-shift + glow) to call out an action worth taking now — e.g. unsaved changes, unapplied filters. */
    blinking?: boolean;
}
/**
 * A plain <button> that can pulse. One shared "this needs attention" visual
 * language for every button in the RBE suite (Save, Table's Search, the
 * sidebar Refresh, …) instead of each app/page inventing its own animation.
 * All other props/children pass through untouched — this only ever adds a
 * class, never restyles the button otherwise.
 */
export declare function BlinkButton({ blinking, className, ...rest }: BlinkButtonProps): import("react").JSX.Element;
