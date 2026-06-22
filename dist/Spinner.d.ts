export interface SpinnerProps {
    /** Text shown under the spinner (also used as the accessible label). */
    label?: string;
}
/**
 * Rail Baltica branded loading animation: navy→gold arc with a Material-style
 * indeterminate sweep and a gently breathing label. Styles self-inject, so no
 * CSS import is required in the consuming app.
 */
export declare function Spinner({ label }: SpinnerProps): import("react").JSX.Element;
