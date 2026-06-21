import Link from "next/link";

export default function StatisticalAnalysisPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        href="/dashboard"
        style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          marginBottom: "1.5rem",
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Statistical Analysis</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
        Coming soon — charts and insights about your job search will live here.
      </p>
    </div>
  );
}