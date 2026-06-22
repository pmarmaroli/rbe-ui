import { ensureStyles } from './styles';

export interface SpinnerProps {
  /** Text shown under the spinner (also used as the accessible label). */
  label?: string;
}

/**
 * Rail Baltica branded loading animation: navy→gold arc with a Material-style
 * indeterminate sweep and a gently breathing label. Styles self-inject, so no
 * CSS import is required in the consuming app.
 */
export function Spinner({ label = 'Loading' }: SpinnerProps) {
  ensureStyles();
  return (
    <div className="rbe-loader-wrap" role="status" aria-live="polite" aria-label={label}>
      <svg className="rbe-loader-svg" viewBox="0 0 50 50" aria-hidden="true">
        <defs>
          {/* Blue dominates ~80% of the arc; gradient to yellow over the last 20%. */}
          <linearGradient id="rbeLoaderGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d47a1" />
            <stop offset="80%" stopColor="#0d47a1" />
            <stop offset="100%" stopColor="#fbc02d" />
          </linearGradient>
        </defs>
        <circle className="rbe-track" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
        <circle className="rbe-arc" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
      <div className="rbe-loader-label">
        {label}<span className="rbe-dot">.</span><span className="rbe-dot">.</span><span className="rbe-dot">.</span>
      </div>
    </div>
  );
}
