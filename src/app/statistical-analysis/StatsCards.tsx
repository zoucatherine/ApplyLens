// src/app/statistical-analysis/StatsCards.tsx


type Props = {
  total: number;
  responseRate: number | null;
  decisionRate: number | null;
  topSource: string | null;
};

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "1rem 1.25rem",
  flex: "1 1 180px",
};

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{value}</div>
      {sub && (
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

export default function StatsCards({ total, responseRate, decisionRate, topSource }: Props) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
      <Stat
        label="Total Applications"
        value={String(total)}
        sub={total === 1 ? "1 application tracked" : `${total} applications tracked`}
      />
      <Stat
        label="Response Rate"
        value={responseRate !== null ? `${responseRate}%` : "—"}
        sub={responseRate !== null ? "got any response" : "no data yet"}
      />
      <Stat
        label="Decision Rate"
        value={decisionRate !== null ? `${decisionRate}%` : "—"}
        sub={decisionRate !== null ? "reached a final outcome" : "no decisions yet"}
      />
      <Stat
        label="Top Source"
        value={topSource ?? "—"}
        sub={topSource ? "most applications from" : "add source to applications"}
      />
    </div>
  );
}