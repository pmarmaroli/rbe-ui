import { jsx as _jsx } from "react/jsx-runtime";
import { ensureBlinkStyles } from './blinkStyles';
/**
 * A plain <button> that can pulse. One shared "this needs attention" visual
 * language for every button in the RBE suite (Save, Table's Search, the
 * sidebar Refresh, …) instead of each app/page inventing its own animation.
 * All other props/children pass through untouched — this only ever adds a
 * class, never restyles the button otherwise.
 */
export function BlinkButton({ blinking, className, ...rest }) {
    ensureBlinkStyles();
    return _jsx("button", { ...rest, className: [className, blinking && 'rbe-blink'].filter(Boolean).join(' ') });
}
