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
    <>
      {/* Component-scoped Hover Effects */}
      <style>{`
        .stat-card {
          background: rgba(20, 15, 35, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 1rem 1.15rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        
        /* Total Apps - White/Purple Glow */
        .card-total:hover {
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.06);
        }
        /* Response Rate - Blue Glow */
        .card-response:hover {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.15);
        }
        /* Interview Rate - Amber Glow */
        .card-interview:hover {
          border-color: rgba(245, 158, 11, 0.4);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.15);
        }
        /* Offer Rate - Green Glow */
        .card-offer:hover {
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
        }
        /* Avg Days - Purple Glow */
        .card-avg:hover {
          border-color: rgba(167, 139, 250, 0.4);
          box-shadow: 0 0 16px rgba(167, 139, 250, 0.15);
        }
      `}</style>

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "1rem", 
          marginBottom: "1.5rem" 
        }}
      >
        
        {/* Total Applications */}
        <div className="stat-card card-total">
          <div style={labelStyle}>Total Applications</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
            {totalApps}
          </div>
        </div>

        {/* Response Rate */}
        <div className="stat-card card-response">
          <div style={labelStyle}>Response Rate</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#3b82f6", marginTop: "0.25rem" }}>
            {responseRate}%
          </div>
          <div style={subTextStyle}>{responseCount} of {appliedCount} responded</div>
        </div>

        {/* Interview Rate */}
        <div className="stat-card card-interview">
          <div style={labelStyle}>Interview Rate</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f59e0b", marginTop: "0.25rem" }}>
            {interviewRate}%
          </div>
          <div style={subTextStyle}>{interviewCount} interviews</div>
        </div>

        {/* Offer Rate */}
        <div className="stat-card card-offer">
          <div style={labelStyle}>Offer Rate</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#10b981", marginTop: "0.25rem" }}>
            {offerRate}%
          </div>
          <div style={subTextStyle}>{offerCount} offers</div>
        </div>

        {/* Avg Days to Response */}
        <div className="stat-card card-avg">
          <div style={labelStyle}>Avg Days to Response</div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#a78bfa", marginTop: "0.25rem" }}>
            {avgDaysToResponse || "—"}
          </div>
          <div style={subTextStyle}>{trackedDatesCount} tracked</div>
        </div>
      </div>
    </>
  );
}

// Consistent Design Token Objects 
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