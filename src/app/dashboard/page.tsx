// src/app/dashboard/page.tsx
// This is a Server Component — data is fetched on the server

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ApplicationStatus, PIPELINE_STATUSES, STATUS_COLORS, STATUS_LABELS } from "@/types";
import ApplicationRow from "./ApplicationRow";

type Props = {
  searchParams: Promise<{
    status?: string;
    sort?: string;
    order?: string;
    search?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { status: statusParam, sort, order, search } = await searchParams;
  const statusFilter = statusParam as ApplicationStatus | undefined;
  const sortField = sort as "company" | "role" | "appliedDate" | "followUpDate" | undefined;
  const sortOrder = order === "asc" ? "asc" : "desc";
  const searchQuery = search?.trim() || "";

  // Map sort fields to Prisma field names
  const sortFieldMap: Record<string, string> = {
    company: "company",
    role: "role",
    appliedDate: "appliedDate",
    followUpDate: "followUpDate",
  };

  // Helper to build sort URL preserving other params
  const buildSortUrl = (field: string) => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);
    if (sort === field) {
      params.set("sort", field);
      params.set("order", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "asc");
    }
    return `/dashboard?${params.toString()}`;
  };

  // Build where clause for Prisma
  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { company: { contains: searchQuery, mode: "insensitive" as const } },
            { role: { contains: searchQuery, mode: "insensitive" as const } },
            { notes: { contains: searchQuery, mode: "insensitive" as const } },
            { location: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Fetch filtered applications with sorting
  const applications = await prisma.application.findMany({
    where,
    orderBy: sortField && sortFieldMap[sortField]
      ? { [sortFieldMap[sortField]]: sortOrder }
      : { updatedAt: "desc" },
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

  // Analytics calculations
  const totalApps = applications.length;
  const appliedCount = applications.filter(a => a.status !== "WISHLIST" && a.status !== "WITHDRAWN").length;
  const responseCount = applications.filter(a => ["PHONE_SCREEN", "INTERVIEW", "OFFER", "REJECTED"].includes(a.status)).length;
  const interviewCount = applications.filter(a => ["PHONE_SCREEN", "INTERVIEW"].includes(a.status)).length;
  const offerCount = applications.filter(a => a.status === "OFFER").length;
  const rejectedCount = applications.filter(a => a.status === "REJECTED").length;

  const responseRate = appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0;
  const interviewRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
  const offerRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0;

  const appsWithDates = applications.filter(a => a.followUpDate || a.decisionDate);
  const avgDaysToResponse = appsWithDates.length > 0
    ? Math.round(appsWithDates.reduce((sum, a) => {
        const applied = new Date(a.appliedDate).getTime();
        const response = new Date(a.followUpDate || a.decisionDate!).getTime();
        return sum + (response - applied) / (1000 * 60 * 60 * 24);
      }, 0) / appsWithDates.length)
    : 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "calc(56px + 2rem) 1rem 2rem" }}>
      {/* Analytics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Applications</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginTop: "0.5rem" }}>{totalApps}</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Response Rate</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#60a5fa", marginTop: "0.5rem" }}>{responseRate}%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{responseCount} of {appliedCount} responded</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Interview Rate</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f59e0b", marginTop: "0.5rem" }}>{interviewRate}%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{interviewCount} interviews</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Offer Rate</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#34d399", marginTop: "0.5rem" }}>{offerRate}%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{offerCount} offers</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Avg Days to Response</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a78bfa", marginTop: "0.5rem" }}>{avgDaysToResponse || "—"}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{appsWithDates.length} tracked</div>
        </div>
      </div>

      {/* Header */}
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            {statusFilter ? `Showing ${STATUS_LABELS[statusFilter]}` : "All applications"}
            {applications.length > 0 && ` — ${applications.length} result${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        
                <div style={{ display: "flex", gap: "0.75rem" }}>
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

      {/* Search bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <form
          style={{ display: "flex", gap: "0.5rem" }}
          action="/dashboard"
          method="GET"
        >
          {statusFilter && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          {sort && <input type="hidden" name="sort" value={sort} />}
          {order && <input type="hidden" name="order" value={order} />}
          <input
            type="search"
            name="search"
            value={searchQuery}
            placeholder="Search company, role, notes, location..."
            className="search-input"
          />
          {searchQuery && (
            <a
              href={buildSortUrl(sortField || "company").replace(/search=[^&]*&?/, "")}
              className="clear-btn"
              title="Clear search"
            >
              ✕
            </a>
          )}
        </form>
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
              {[
                { key: "company", label: "Company", sortable: true },
                { key: "role", label: "Role", sortable: true },
                { key: "status", label: "Status", sortable: false },
                { key: "appliedDate", label: "Applied", sortable: true },
                { key: "followUpDate", label: "Follow-up", sortable: true },
                { key: "", label: "", sortable: false },
              ].map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "0.6rem 1rem",
                    color: col.sortable ? "var(--text)" : "var(--text-muted)",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.sortable ? (
                    <a
                      href={buildSortUrl(col.key)}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {col.label}
                      {sort === col.key && (
                        <span style={{ fontSize: "0.7rem" }}>
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </a>
                  ) : (
                    col.label
                  )}
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