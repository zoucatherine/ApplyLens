// src/app/dashboard/page.tsx
// This is a Server Component — data is fetched on the server

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ApplicationStatus, PIPELINE_STATUSES, STATUS_COLORS, STATUS_LABELS } from "@/types";
import ApplicationRow from "./ApplicationRow";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const statusFilter = statusParam as ApplicationStatus | undefined;

  // Build where clause for Prisma
  const where = statusFilter ? { status: statusFilter } : {};

  // Fetch filtered applications
  const applications = await prisma.application.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  // For stats, we need total counts (unfiltered) to show in the filter bar
  // But we could also show filtered counts - let's do filtered for consistency
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
            {statusFilter ? `Showing ${STATUS_LABELS[statusFilter]}` : "All applications"}
            {applications.length > 0 && ` — ${applications.length} result${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        
                <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/statistical-analysis"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              padding: "0.6rem 1.25rem",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            📊 Statistics
          </Link>
          <Link
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
          </Link>
        </div>
      </div>

      {/* Status filter bar */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Filter:</span>
        <Link
          href="/dashboard"
          style={{
            padding: "0.4rem 0.85rem",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 600,
            background: !statusFilter ? "var(--accent)" : "var(--surface)",
            color: !statusFilter ? "#fff" : "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          All
        </Link>
        {PIPELINE_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/dashboard?status=${status}`}
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: 20,
              fontSize: "0.8rem",
              fontWeight: 600,
              background: statusFilter === status ? STATUS_COLORS[status] : "var(--surface)",
              color: statusFilter === status ? "#fff" : "var(--text)",
              border: `1px solid ${statusFilter === status ? STATUS_COLORS[status] : "var(--border)"}`,
            }}
          >
            {STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {/* Stats row (filtered) */}
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
              opacity: statusFilter && statusFilter !== status ? 0.5 : 1,
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
          <p style={{ fontSize: "1.1rem" }}>
            {statusFilter
              ? `No applications with status "${STATUS_LABELS[statusFilter]}"`
              : "No applications yet."}
          </p>
          {!statusFilter && (
            <Link href="/applications/new" style={{ color: "var(--accent)", marginTop: 8, display: "inline-block" }}>
              Add your first one →
            </Link>
          )}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              {["Company", "Role", "Status", "Applied", "Follow-up", ""].map((h) => (
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