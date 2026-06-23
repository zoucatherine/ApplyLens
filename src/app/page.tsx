import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "5rem 1rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        ApplyLens
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
        Track every application, follow-up, and outcome in one place.
        Stop losing track of where you applied and start understanding
        what's actually working.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link
          href="/dashboard"
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "0.7rem 1.5rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}
        >
          Go to Dashboard →
        </Link>
        <Link
          href="/applications/new"
          style={{
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            padding: "0.7rem 1.5rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}
        >
          + Add Application
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "4rem",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}
      >
        {[
          ["📋", "Track applications", "Log every job you apply to with status, dates, and notes."],
          ["📊", "Analyze your pipeline", "See where applications drop off and what sources work best."],
          ["🔔", "Follow-up reminders", "Set follow-up dates so nothing slips through the cracks."],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ maxWidth: 160 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{icon}</div>
            <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{title}</div>
            <div style={{ lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}