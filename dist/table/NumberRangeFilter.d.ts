interface Props {
    min: string;
    max: string;
    onChange: (next: {
        min: string;
        max: string;
    }) => void;
    onEnter?: () => void;
    className?: string;
}
/**
 * Presentational min/max filter cell for numeric columns. Purely UI — the page
 * still owns predicate application (compare each row's numeric value against
 * `min`/`max`), same division of responsibility as every other `filterCell`.
 */
export declare function NumberRangeFilter({ min, max, onChange, onEnter, className }: Props): import("react").JSX.Element;
export {};
