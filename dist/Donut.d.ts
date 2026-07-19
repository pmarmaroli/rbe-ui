export interface DonutSlice {
    /** Stable key; falls back to label. */
    id?: string;
    label: string;
    /** Arc size driver. */
    value: number;
    /** Pre-resolved color — palette/status-to-color logic stays in the caller. */
    color: string;
    /** Overrides the value/percent shown in this slice's label/tooltip (e.g. a grouped pair's combined total). */
    displayValue?: number;
    /** Renders with a diagonal hatch overlay instead of a solid fill. */
    decal?: boolean;
    /** Suppresses this slice's on-arc label (e.g. the 2nd slice of a decal pair). */
    hideLabel?: boolean;
}
export interface DonutProps {
    slices: DonutSlice[];
    /** Center value, e.g. "128". Rendered as plain text — caller controls formatting/units. */
    centerValue?: React.ReactNode;
    /** Center caption below the value, e.g. "Present" / "Total". */
    centerLabel?: string;
    /** Height in px of the chart area; width fills the container. */
    height?: number;
    /** 'none' (default) = ring only, caller renders its own legend/interactions. 'bottom' = ECharts-native bottom legend. */
    legend?: 'none' | 'bottom';
    /** Inner radius as a fraction of the outer radius, 0–1. Default 0.5. */
    innerRadius?: number;
    /** Where on-arc labels are drawn. Default 'inside'. */
    labelPosition?: 'inside' | 'outside' | 'none';
    /** Per-slice label/tooltip value formatter. Default: rounds to the nearest integer. */
    formatValue?: (v: number) => string;
    /** Tooltip content override. Pass `false` to disable the tooltip entirely. */
    tooltip?: false | ((slice: DonutSlice, percent: number) => string);
    onSliceClick?: (slice: DonutSlice) => void;
    className?: string;
}
/** Shared donut/pie chart (Apache ECharts, gradient-fill "Alliance" visual identity). */
export declare function Donut({ slices, centerValue, centerLabel, height, legend, innerRadius, labelPosition, formatValue, tooltip, onSliceClick, className, }: DonutProps): import("react").JSX.Element;
