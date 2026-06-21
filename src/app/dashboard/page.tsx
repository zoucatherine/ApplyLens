// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, PIPELINE_STATUSES, STATUS_COLORS, STATUS_LABELS } from "@/types";
import ApplicationRow from "./ApplicationRow";

export default async function DashboardPage() {
  const applications = await prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const counts = PIPELINE_STATUSES.reduce(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status).length;
      return acc;
    },
    {} as Record<ApplicationStatus, number>
  );


  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Job Tracker</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            {applications.length} total applications
          </p>
        </div>
        <a
          href="/applications/new"
          style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "0.6rem 1.25rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          + Add Application
        </a>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {PIPELINE_STATUSES.map((status) => (
          <div
            key={status}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${STATUS_COLORS[status]}`,
              borderRadius: 8,
              padding: "0.75rem 1rem",
              minWidth: 110,
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{counts[status]}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
              {STATUS_LABELS[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Applications table */}
      {applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "1.1rem" }}>No applications yet.</p>
          <a href="/applications/new" style={{ color: "var(--accent)", marginTop: 8, display: "inline-block" }}>
            Add your first one →
          </a>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              {["Company", "Role", "Status", "Applied", "Follow-up"].map((h) => (
                <th key={h} style={{ padding: "0.6rem 1rem", color: "var(--text-muted)", fontWeight: 500, fontSize: "0.85rem" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <ApplicationRow key={app.id} app={app} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}