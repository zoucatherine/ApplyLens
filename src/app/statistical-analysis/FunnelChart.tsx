// src/app/statistical-analysis/FunnelChart.tsx
"use client";

import { useRef, useState } from "react";

type UndecidedBreakdown = {
  wishlist: number;
  applied: number;
  phoneScreen: number;
  interview: number;
};

type Counts = {
  total: number;
  undecided: number;
  decided: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  undecidedBreakdown: UndecidedBreakdown;
};

const NODE_W = 14;

// Widescreen Chart Scaling Constraints
const CHART_W = 960; 
const CHART_H = 300; 

// Evenly distributed columns across the wider grid canvas
const X_SOURCE = 30;
const X_LEVEL1 = 400;
const X_LEVEL2 = 780; 

function scaleHeight(count: number, total: number, max: number, min: number) {
  if (total === 0) return min;
  const h = (count / total) * max;
  return Math.max(min, h);
}

function flowPath(x1: number, y1Top: number, y1Bottom: number, x2: number, y2Top: number, y2Bottom: number) {
  const xi = (x1 + x2) / 2;
  return `M${x1},${y1Top} C${xi},${y1Top} ${xi},${y2Top} ${x2},${y2Top} L${x2},${y2Bottom} C${xi},${y2Bottom} ${xi},${y1Bottom} ${x1},${y1Bottom} Z`;
}

export default function FunnelChart({ counts }: { counts: Counts }) {
  const { total, undecided, decided, offer, rejected, withdrawn, undecidedBreakdown } = counts;

  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  function handleUndecidedHover(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
        <p>No applications yet — add one to see your funnel.</p>
      </div>
    );
  }

  const sourceH = 50;
  const sourceY = CHART_H / 2 - sourceH / 2;
  const sourceYMid = sourceY + sourceH / 2;

  const GAP_1 = 16;
  const undecidedH = scaleHeight(undecided, total, 130, 12);
  const decidedH = scaleHeight(decided, total, 130, 12);
  const level1TotalH = undecidedH + decidedH + GAP_1;
  const level1Y = CHART_H / 2 - level1TotalH / 2;

  const undecidedY = level1Y;
  const decidedY = undecidedY + undecidedH + GAP_1;

  const decidedTotal = offer + rejected + withdrawn || 1;
  const GAP_2 = 14;
  const offerH = scaleHeight(offer, decidedTotal, 80, 10);
  const rejectedH = scaleHeight(rejected, decidedTotal, 80, 10);
  const withdrawnH = scaleHeight(withdrawn, decidedTotal, 80, 10);
  const level2TotalH = offerH + rejectedH + withdrawnH + GAP_2 * 2;
  const level2Y = CHART_H / 2 - level2TotalH / 2;

  const offerY = level2Y;
  const rejectedY = offerY + offerH + GAP_2;
  const withdrawnY = rejectedY + rejectedH + GAP_2;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      
      {/* Dynamic inline entry animations */}
      <style>{`
        @keyframes revealFlow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes nodeGrow {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes labelReveal {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .flow-mask-rect {
          transform-origin: left center;
          transform: scaleX(0); /* <-- CRITICAL: Forces it to start completely hidden/blank */
          animation: revealFlow 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .sankey-node {
          transform-origin: center;
          opacity: 0; /* <-- Prevents flashing before nodeGrow triggers */
          animation: nodeGrow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .sankey-text {
          opacity: 0; /* <-- Prevents flashing before labelReveal triggers */
          animation: labelReveal 0.5s ease-out forwards;
        }
      `}</style>

      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        width="100%"
        height="100%"
        style={{ display: "block", overflow: "visible" }}
        role="img"
      >
        {/* Definitional Clip Paths */}
        <defs>
          <clipPath id="reveal-mask-tier1">
            <rect className="flow-mask-rect" x="0" y="0" width={X_LEVEL1} height={CHART_H} style={{ animationDelay: "0.1s" }} />
          </clipPath>
          <clipPath id="reveal-mask-tier2">
            <rect className="flow-mask-rect" x={X_LEVEL1} y="0" width={CHART_W - X_LEVEL1} height={CHART_H} style={{ animationDelay: "0.4s" }} />
          </clipPath>
        </defs>

        {/* Tier 0 Node */}
        <rect className="sankey-node" x={X_SOURCE} y={sourceY} width={NODE_W} height={sourceH} rx="4" style={{ fill: "var(--text-muted)", animationDelay: "0s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.2s" }}>
          <text x={X_SOURCE + NODE_W + 10} y={sourceYMid - 5} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Applications
          </text>
          <text x={X_SOURCE + NODE_W + 10} y={sourceYMid + 13} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {total} total
          </text>
        </g>

        {/* ========================================== */}
        {/* TIER 1 FLOWS (MAPPED INTO THE CLIP-MASK)   */}
        {/* ========================================== */}
        <g clipPath="url(#reveal-mask-tier1)">
          {/* Flow: Applications -> Undecided (hoverable) */}
          <path
            d={flowPath(X_SOURCE + NODE_W, sourceY, sourceY + sourceH, X_LEVEL1, undecidedY, undecidedY + undecidedH)}
            style={{
              fill: "var(--text-muted)",
              fillOpacity: tooltip ? 0.35 : 0.2,
              cursor: "pointer",
              transition: "fill-opacity 0.15s",
            }}
            onMouseMove={handleUndecidedHover}
            onMouseLeave={() => setTooltip(null)}
          />
          {/* Flow: Applications -> Decided */}
          <path
            d={flowPath(X_SOURCE + NODE_W, sourceY, sourceY + sourceH, X_LEVEL1, decidedY, decidedY + decidedH)}
            style={{ fill: "var(--text-muted)", fillOpacity: 0.12 }}
          />
        </g>

        {/* Tier 1 Nodes */}
        <rect className="sankey-node" x={X_LEVEL1} y={undecidedY} width={NODE_W} height={undecidedH} rx="4" style={{ fill: "var(--text-muted)", animationDelay: "0.4s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.5s" }}>
          <text x={X_LEVEL1 + NODE_W + 10} y={undecidedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Undecided
          </text>
          <text x={X_LEVEL1 + NODE_W + 10} y={undecidedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {undecided} in progress
          </text>
        </g>

        <rect className="sankey-node" x={X_LEVEL1} y={decidedY} width={NODE_W} height={decidedH} rx="4" style={{ fill: "var(--text-muted)", animationDelay: "0.4s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.5s" }}>
          <text x={X_LEVEL1 + NODE_W + 10} y={decidedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Decided
          </text>
          <text x={X_LEVEL1 + NODE_W + 10} y={decidedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {decided}
          </text>
        </g>

        {/* ========================================== */}
        {/* TIER 2 FLOWS (MAPPED INTO THE CLIP-MASK)   */}
        {/* ========================================== */}
        <g clipPath="url(#reveal-mask-tier2)">
          {/* Flow: Decided -> Offer */}
          <path
            d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, offerY, offerY + offerH)}
            style={{ fill: "#22c55e", fillOpacity: 0.15 }}
          />
          {/* Flow: Decided -> Rejected */}
          <path
            d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, rejectedY, rejectedY + rejectedH)}
            style={{ fill: "var(--danger)", fillOpacity: 0.15 }}
          />
          {/* Flow: Decided -> Withdrawn */}
          <path
            d={flowPath(X_LEVEL1 + NODE_W, decidedY, decidedY + decidedH, X_LEVEL2, withdrawnY, withdrawnY + withdrawnH)}
            style={{ fill: "var(--text-muted)", fillOpacity: 0.15 }}
          />
        </g>

        {/* Tier 2 Nodes */}
        <rect className="sankey-node" x={X_LEVEL2} y={offerY} width={NODE_W} height={offerH} rx="4" style={{ fill: "#22c55e", animationDelay: "0.8s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.9s" }}>
          <text x={X_LEVEL2 + NODE_W + 10} y={offerY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Offer
          </text>
          <text x={X_LEVEL2 + NODE_W + 10} y={offerY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {offer}
          </text>
        </g>

        <rect className="sankey-node" x={X_LEVEL2} y={rejectedY} width={NODE_W} height={rejectedH} rx="4" style={{ fill: "var(--danger)", animationDelay: "0.8s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.9s" }}>
          <text x={X_LEVEL2 + NODE_W + 10} y={rejectedY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Rejected
          </text>
          <text x={X_LEVEL2 + NODE_W + 10} y={rejectedY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {rejected}
          </text>
        </g>

        <rect className="sankey-node" x={X_LEVEL2} y={withdrawnY} width={NODE_W} height={withdrawnH} rx="4" style={{ fill: "var(--text-muted)", animationDelay: "0.8s" }} />
        <g className="sankey-text" style={{ animationDelay: "0.9s" }}>
          <text x={X_LEVEL2 + NODE_W + 10} y={withdrawnY + 14} style={{ fill: "var(--text)", fontSize: 13, fontWeight: 600 }}>
            Withdrawn
          </text>
          <text x={X_LEVEL2 + NODE_W + 10} y={withdrawnY + 32} style={{ fill: "var(--text-muted)", fontSize: 12 }}>
            {withdrawn}
          </text>
        </g>
      </svg>

      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0.6rem 0.85rem",
            fontSize: "0.8rem",
            color: "var(--text)",
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            minWidth: 140,
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Undecided breakdown</div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Wishlist</span>
            <span>{undecidedBreakdown.wishlist}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Applied</span>
            <span>{undecidedBreakdown.applied}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Phone screen</span>
            <span>{undecidedBreakdown.phoneScreen}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
            <span>Interview</span>
            <span>{undecidedBreakdown.interview}</span>
          </div>
        </div>
      )}
    </div>
  );
}