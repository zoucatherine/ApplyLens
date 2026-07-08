// src/app/statistical-analysis/StatsCards.tsx

type Props = {
  totalApps: number;
  responseRate: number;
  appliedCount: number;
  responseCount: number;
  interviewRate: number;
  interviewCount: number;
  offerRate: number;
  offerCount: number;
  avgDaysToResponse: number;
  trackedDatesCount: number;
};

export default function StatsCards({
  totalApps,
  responseRate,
  appliedCount,
  responseCount,
  interviewRate,
  interviewCount,
  offerRate,
  offerCount,
  avgDaysToResponse,
  trackedDatesCount,
}: Props) {
  return (
    /* Tightened the grid's bottom margin to 1rem */
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
      
      {/* Total Applications */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Applications</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text)", marginTop: "0.25rem" }}>{totalApps}</div>
      </div>

      {/* Response Rate */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Response Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#60a5fa", marginTop: "0.25rem" }}>{responseRate}%</div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{responseCount} of {appliedCount} responded</div>
      </div>

      {/* Interview Rate */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Interview Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f59e0b", marginTop: "0.25rem" }}>{interviewRate}%</div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{interviewCount} interviews</div>
      </div>

      {/* Offer Rate */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Offer Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#34d399", marginTop: "0.25rem" }}>{offerRate}%</div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{offerCount} offers</div>
      </div>

      {/* Avg Days to Response */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Days to Response</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#a78bfa", marginTop: "0.25rem" }}>{avgDaysToResponse || "—"}</div>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{trackedDatesCount} tracked</div>
      </div>
    </div>
  );
}