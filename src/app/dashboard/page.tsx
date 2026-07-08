// src/app/dashboard/page.tsx
// This is a Server Component — data is fetched on the server

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ApplicationStatus, PIPELINE_STATUSES, STATUS_LABELS } from "@/types";
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

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: "1.5rem 2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            {statusFilter ? `Showing ${STATUS_LABELS[statusFilter]}` : "All applications"}
            {applications.length > 0 && ` — ${applications.length} result${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        
        <div>
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

      {/* Combined Search & Filter Controls Bar */}
      <div style={{ marginBottom: "2rem" }}>
        <form
          style={{ display: "flex", gap: "0.5rem", width: "100%" }}
          action="/dashboard"
          method="GET"
        >
          {sort && <input type="hidden" name="sort" value={sort} />}
          {order && <input type="hidden" name="order" value={order} />}
          
          {/* Main Search Input */}
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="search"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search company, role, notes, location..."
              className="search-input"
              style={{ width: "100%" }}
            />
            {searchQuery && (
              <a
                href={statusFilter ? `/dashboard?status=${statusFilter}` : "/dashboard"}
                className="clear-btn"
                title="Clear search"
                style={{ right: "12px" }}
              >
                ✕
              </a>
            )}
          </div>

          {/* Wrapper to hold dropdown and native search action together */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* FIXED: Removed onChange function so it is a pure HTML server component element */}
            <select
              name="status"
              defaultValue={statusFilter || ""}
              style={{
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0 1rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                minWidth: "150px"
              }}
            >
              <option value="">All Statuses</option>
              {PIPELINE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            {/* Added explicit Go/Filter button instead of runtime JavaScript event handlers */}
            <button
              type="submit"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                padding: "0 1rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Applications Table View */}
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
                    padding: "0.8rem 1rem",
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