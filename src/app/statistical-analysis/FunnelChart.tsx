// src/app/statistical-analysis/FunnelChart.tsx

type Counts = {
  total: number;
  undecided: number;
  decided: number;
  offer: number;
  rejected: number;
  withdrawn: number;
};

const NODE_W = 14;
const X_SOURCE = 20;
const X_LEVEL1 = 380;
const X_LEVEL2 = 660;
const CHART_W = 720;
const CHART_H = 320;

function scaleHeight(count: number, total: number, max: number, min: number) {
  if (total === 0) return min;
  const h = (count / total) * max;
  return Math.max(min, h);
}

// Standard sankey-style link shape: two cubic beziers forming a tapered ribbon
function flowPath(x1: number, y1Top: number, y1Bottom: number, x2: number, y2Top: number, y2Bottom: number) {
  const xi = (x1 + x2) / 2;
  return `M${x1},${y1Top} C${xi},${y1Top} ${xi},${y2Top} ${x2},${y2Top} L${x2},${y2Bottom} C${xi},${y2Bottom} ${xi},${y1Bottom} ${x1},${y1Bottom} Z`;
}

export default function FunnelChart({ counts }: { counts: Counts }) {
  const { total, undecided, decided, offer, rejected, withdrawn } = counts;

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
        <p>No applications yet — add one to see your funnel.</p>
      </div>
    );
  }

  // Source node (Applications) — fixed height, centered vertically
  const sourceH = 50;
  const sourceY = CHART_H / 2 - sourceH / 2;
  const sourceYMid = sourceY + sourceH / 2;

  // Level 1: Undecided / Decided, stacked with a gap, scaled by proportion of total
  const GAP_1 = 16;
  const undecidedH = scaleHeight(undecided, total, 140, 10);
  const decidedH = scaleHeight(decided, total, 140, 10);
  const level1TotalH = undecidedH + decidedH + GAP_1;
  const level1Y = CHART_H / 2 - level1TotalH / 2;

  const undecidedY = level1Y;
  const decidedY = undecidedY + undecidedH + GAP_1;
  const decidedYMid = decidedY + decidedH / 2;

  // Level 2: Offer / Rejected / Withdrawn — only meaningful if decided > 0
  const decidedTotal = offer + rejected + withdrawn || 1;
  const GAP_2 = 14;
  const offerH = scaleHeight(offer, decidedTotal, 90, 8);
  const rejectedH = scaleHeight(rejected, decidedTotal, 90, 8);
  const withdrawnH = scaleHeight(withdrawn, decidedTotal, 90, 8);
  const level2TotalH = offerH + rejectedH + withdrawnH + GAP_2 * 2;
  const level2Y = CHART_H / 2 - level2TotalH / 2;

  const offerY = level2Y;
  const rejectedY = offerY + offerH + GAP_2;
  const withdrawnY = rejectedY + rejectedH + GAP_2;

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      width="100%"
      role="img"
      aria-label={`Application funnel: ${total} total, ${undecided} undecided, ${decided} decided (${offer} offer, ${rejected} rejected, ${withdrawn} withdrawn)`}
    >
      {/* Applications source node */}
      <rect x={X_SOURCE} y={sourceY} width={NODE_W} height={sourceH} rx="4" style={{ fill: "var(--text-muted)" }} />
      <text x={X_SOURCE + NODE_W + 10} y={sourceYMid - 6} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Applications
      </text>
      <text x={X_SOURCE + NODE_W + 10} y={sourceYMid + 12} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {total} total
      </text>

      {/* Flow: Applications -> Undecided */}
      <path
        d={flowPath(X_SOURCE + NODE_W, sourceY, sourceY + sourceH, X_LEVEL1, undecidedY, undecidedY + undecidedH)}
        style={{ fill: "var(--text-muted)", fillOpacity: 0.25 }}
      />
      <rect x={X_LEVEL1} y={undecidedY} width={NODE_W} height={undecidedH} rx="4" style={{ fill: "var(--text-muted)" }} />
      <text x={X_LEVEL1 + NODE_W + 10} y={undecidedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Undecided
      </text>
      <text x={X_LEVEL1 + NODE_W + 10} y={undecidedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {undecided} in progress
      </text>

      {/* Flow: Applications -> Decided */}
      <path
        d={flowPath(X_SOURCE + NODE_W, sourceY, sourceY + sourceH, X_LEVEL1, decidedY, decidedY + decidedH)}
        style={{ fill: "var(--text-muted)", fillOpacity: 0.15 }}
      />
      <rect x={X_LEVEL1} y={decidedY} width={NODE_W} height={decidedH} rx="4" style={{ fill: "var(--text-muted)" }} />
      <text x={X_LEVEL1 + NODE_W + 10} y={decidedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Decided
      </text>
      <text x={X_LEVEL1 + NODE_W + 10} y={decidedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {decided}
      </text>

      {/* Flow: Decided -> Offer */}
      <path
        d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, offerY, offerY + offerH)}
        style={{ fill: "#22c55e", fillOpacity: 0.18 }}
      />
      <rect x={X_LEVEL2} y={offerY} width={NODE_W} height={offerH} rx="4" style={{ fill: "#22c55e" }} />
      <text x={X_LEVEL2 + NODE_W + 10} y={offerY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Offer
      </text>
      <text x={X_LEVEL2 + NODE_W + 10} y={offerY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {offer}
      </text>

      {/* Flow: Decided -> Rejected */}
      <path
        d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, rejectedY, rejectedY + rejectedH)}
        style={{ fill: "var(--danger)", fillOpacity: 0.18 }}
      />
      <rect x={X_LEVEL2} y={rejectedY} width={NODE_W} height={rejectedH} rx="4" style={{ fill: "var(--danger)" }} />
      <text x={X_LEVEL2 + NODE_W + 10} y={rejectedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Rejected
      </text>
      <text x={X_LEVEL2 + NODE_W + 10} y={rejectedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {rejected}
      </text>

      {/* Flow: Decided -> Withdrawn */}
      <path
        d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, withdrawnY, withdrawnY + withdrawnH)}
        style={{ fill: "var(--text-muted)", fillOpacity: 0.18 }}
      />
      <rect x={X_LEVEL2} y={withdrawnY} width={NODE_W} height={withdrawnH} rx="4" style={{ fill: "var(--text-muted)" }} />
      <text x={X_LEVEL2 + NODE_W + 10} y={withdrawnY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
        Withdrawn
      </text>
      <text x={X_LEVEL2 + NODE_W + 10} y={withdrawnY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
        {withdrawn}
      </text>
    </svg>
  );
}