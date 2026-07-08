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
    <div 
      style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
        gap: "1rem", 
        marginBottom: "1.5rem" 
      }}
    >
      
      {/* Total Applications */}
      <div style={cardStyle}>
        <div style={labelStyle}>Total Applications</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
          {totalApps}
        </div>
      </div>

      {/* Response Rate */}
      <div style={cardStyle}>
        <div style={labelStyle}>Response Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3b82f6", marginTop: "0.25rem" }}>
          {responseRate}%
        </div>
        <div style={subTextStyle}>{responseCount} of {appliedCount} responded</div>
      </div>

      {/* Interview Rate */}
      <div style={cardStyle}>
        <div style={labelStyle}>Interview Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f59e0b", marginTop: "0.25rem" }}>
          {interviewRate}%
        </div>
        <div style={subTextStyle}>{interviewCount} interviews</div>
      </div>

      {/* Offer Rate */}
      <div style={cardStyle}>
        <div style={labelStyle}>Offer Rate</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#10b981", marginTop: "0.25rem" }}>
          {offerRate}%
        </div>
        <div style={subTextStyle}>{offerCount} offers</div>
      </div>

      {/* Avg Days to Response */}
      <div style={cardStyle}>
        <div style={labelStyle}>Avg Days to Response</div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#a78bfa", marginTop: "0.25rem" }}>
          {avgDaysToResponse || "—"}
        </div>
        <div style={subTextStyle}>{trackedDatesCount} tracked</div>
      </div>
    </div>
  );
}

// Consistent Design Token Objects 
const cardStyle: React.CSSProperties = {
  background: "rgba(20, 15, 35, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 12,
  padding: "1rem 1.15rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.45)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const subTextStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.3)",
  marginTop: "0.2rem",
};