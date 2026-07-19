import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent, GraphicComponent } from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';
import { ensureDonutStyles } from './donutStyles';

// Register only what the donut needs (pie + SVG renderer) — keeps the unused
// ~95% of echarts (maps, trees, canvas renderer, bar/line charts, …) out of
// the bundle. This is the shared "gradient" visual identity used across the
// Alliance suite (ported from rbe-timesheet's Alliance Dashboard donut).
echarts.use([PieChart, LegendComponent, TooltipComponent, GraphicComponent, SVGRenderer]);

function darken(hex: string, p: number): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return hex;
  const [r, g, b] = m.map(h => parseInt(h, 16));
  const f = (c: number) => Math.round(c * (1 - p)).toString(16).padStart(2, '0');
  return `#${f(r)}${f(g)}${f(b)}`;
}

const SHADE = 0.2;

function applyFill(color: string) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color },
    { offset: 1, color: darken(color, SHADE) },
  ]);
}

// Diagonal hatch overlay marking a slice as a "decal" variant (e.g. a
// design/secondary share of a coloured zone), keeping the underlying colour.
const HATCH_DECAL = {
  color: 'rgba(255,255,255,0.5)',
  dashArrayX: [1, 0],
  dashArrayY: [3, 4],
  rotation: -Math.PI / 4,
};

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(15,23,42,0.92)',
  borderWidth: 0,
  textStyle: { color: '#fff', fontSize: 12 },
  padding: [8, 12] as [number, number],
  extraCssText: 'border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);',
};

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

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Shared donut/pie chart (Apache ECharts, gradient-fill "Alliance" visual identity). */
export function Donut({
  slices,
  centerValue,
  centerLabel,
  height = 120,
  legend = 'none',
  innerRadius = 0.5,
  labelPosition = 'inside',
  formatValue = (v: number) => String(Math.round(v)),
  tooltip,
  onSliceClick,
  className,
}: DonutProps) {
  ensureDonutStyles();

  const total = slices.reduce((sum, sl) => sum + sl.value, 0);

  const outerR = labelPosition === 'outside' ? 56 : 72;
  const innerPct = Math.round(innerRadius * outerR);

  const legendRows = legend === 'bottom' ? Math.max(1, Math.ceil(slices.length / 3)) : 0;
  const legendH = legend === 'bottom' ? legendRows * 22 + 8 : 0;
  const pieTopPx = 10;
  const pieBottomPx = legend === 'bottom' ? legendH + 12 : pieTopPx;
  const pieCenterPct = ((pieTopPx + (height - pieTopPx - pieBottomPx) / 2) / height) * 100;

  const dense = slices.length > 6;
  const veryDense = slices.length > 9;
  const vSize = veryDense ? 10 : dense ? 11 : 13;
  const pSize = veryDense ? 9 : dense ? 10 : 10;
  const showAtPct = veryDense ? 8 : dense ? 6 : 5;

  const option = useMemo(() => {
    type LabelParam = { value: number; percent: number; name: string; data?: { _total?: number } };
    const lblVal = (p: LabelParam) => {
      const v = p.data?._total ?? p.value;
      const pct = p.data?._total !== undefined ? (total > 0 ? Math.round((p.data._total / total) * 100) : 0) : p.percent;
      return { v, pct };
    };

    const labelCfg = labelPosition === 'none'
      ? { show: false }
      : labelPosition === 'inside'
        ? {
            show: true,
            position: 'inside' as const,
            formatter: (p: LabelParam) => {
              const { v, pct } = lblVal(p);
              if (pct < showAtPct) return '';
              if (veryDense) return `{p|${pct}%}`;
              return `{v|${formatValue(v)}}\n{p|${pct}%}`;
            },
            rich: {
              v: { color: '#fff', fontSize: vSize, fontWeight: 700, lineHeight: vSize + 2 },
              p: { color: '#fff', fontSize: pSize, opacity: 0.85, lineHeight: pSize + 2 },
            },
          }
        : {
            show: true,
            position: 'outside' as const,
            formatter: (p: LabelParam) => {
              const { v, pct } = lblVal(p);
              return pct >= 4 ? `${p.name}\n${formatValue(v)} (${pct}%)` : '';
            },
            color: '#475569',
            fontSize: 11,
          };

    type TooltipParam = { name: string; value: number; percent: number; color: string; dataIndex: number };
    const tooltipOption = tooltip === false
      ? undefined
      : {
          ...TOOLTIP_STYLE,
          trigger: 'item' as const,
          formatter: (p: TooltipParam) => {
            if (tooltip) return tooltip(slices[p.dataIndex], p.percent);
            return `<div style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:10px;height:10px;background:${p.color};border-radius:2px;"></span><b>${p.name}</b></div><div style="margin-top:4px;font-size:13px;">${formatValue(p.value)} <span style="opacity:0.7;">(${p.percent}%)</span></div>`;
          },
        };

    return {
      legend: legend === 'bottom'
        ? {
            bottom: 4, type: 'plain', orient: 'horizontal', icon: 'roundRect',
            itemWidth: 10, itemHeight: 10, itemGap: 12,
            textStyle: { fontSize: 11, color: '#475569' },
          }
        : undefined,
      tooltip: tooltipOption,
      series: [{
        type: 'pie',
        radius: [`${innerPct}%`, `${outerR}%`],
        center: ['50%', `${pieCenterPct}%`],
        avoidLabelOverlap: true,
        padAngle: 0,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.12)',
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.25)' },
          label: { show: true, fontSize: 14, fontWeight: 700 },
        },
        label: labelCfg,
        labelLine: { show: labelPosition === 'outside', length: 10, length2: 16 },
        data: slices.map(sl => {
          const itemStyle: Record<string, unknown> = { color: applyFill(sl.color) };
          if (sl.decal) itemStyle.decal = HATCH_DECAL;
          const item: Record<string, unknown> = { name: sl.label, value: sl.value, itemStyle };
          if (sl.displayValue !== undefined) item._total = sl.displayValue;
          if (sl.hideLabel) item.label = { show: false };
          return item;
        }),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (i: number) => i * 40,
      }],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slices, total, innerPct, outerR, pieCenterPct, legend, labelPosition, formatValue, tooltip, showAtPct, veryDense, vSize, pSize]);

  const showCenter = labelPosition === 'inside' && (centerValue != null || centerLabel != null);

  return (
    <div className={cx('rbe-donut', className)} style={{ '--rbe-donut-center-top': `${pieCenterPct}%` } as React.CSSProperties}>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height }}
        opts={{ renderer: 'svg' }}
        notMerge
        onEvents={onSliceClick ? { click: (p: { dataIndex: number }) => onSliceClick(slices[p.dataIndex]) } : undefined}
      />
      {showCenter && (
        <div className="rbe-donut-center">
          {centerValue != null && <div className="rbe-donut-center-value">{centerValue}</div>}
          {centerLabel != null && <div className="rbe-donut-center-label">{centerLabel}</div>}
        </div>
      )}
    </div>
  );
}
