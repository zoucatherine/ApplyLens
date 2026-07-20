// src/app/dashboard/KanbanBoard.tsx
"use client";

import { PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

const COLUMN_COLORS: Record<string, string> = {
  WISHLIST: "#eab308",
  APPLIED: "#3b82f6",
  PHONE_SCREEN: "#a855f7",
  INTERVIEW: "#f97316",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

type Application = {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedDate?: string | Date | null;
  location?: string | null;
  notes?: string | null;
};

export default function KanbanBoard({ applications }: { applications: Application[] }) {
  return (
    <div style={boardContainerStyle}>
      {PIPELINE_STATUSES.map((statusKey) => {
        const columnApps = applications.filter((app) => app.status === statusKey);
        const columnColor = COLUMN_COLORS[statusKey] || "#fff";

        return (
          <div key={statusKey} style={columnStyle}>
            {/* Column Header */}
            <div style={columnHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: columnColor }} />
                <h4 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>
                  {STATUS_LABELS[statusKey as keyof typeof STATUS_LABELS]}
                </h4>
              </div>
              <span style={counterBadgeStyle}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards Stream */}
            <div style={cardsContainerStyle}>
              {columnApps.length === 0 ? (
                <div style={emptyColumnStyle}>No applications</div>
              ) : (
                columnApps.map((app) => (
                  <div key={app.id} style={kanbanCardStyle}>
                    <h5 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#fff" }}>
                      {app.company}
                    </h5>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.825rem", color: "rgba(255, 255, 255, 0.6)" }}>
                      {app.role}
                    </p>
                    {app.appliedDate && (
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.35)" }}>
                        {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Layout styling declarations
const boardContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  overflowX: "auto",
  paddingBottom: "1rem",
  alignItems: "flex-start",
  width: "100%",
};

const columnStyle: React.CSSProperties = {
  flex: "0 0 280px",
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "12px",
  padding: "0.85rem",
  maxHeight: "calc(100vh - 220px)",
  display: "flex",
  flexDirection: "column",
};

const columnHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.85rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
};

const counterBadgeStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "0.75rem",
  fontWeight: 600,
  padding: "0.15rem 0.5rem",
  borderRadius: "10px",
};

const cardsContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  overflowY: "auto",
};

const kanbanCardStyle: React.CSSProperties = {
  background: "#18181b",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "8px",
  padding: "0.85rem",
  cursor: "pointer",
  transition: "border-color 0.15s ease",
};

const emptyColumnStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1.5rem 0",
  fontSize: "0.8rem",
  color: "rgba(255, 255, 255, 0.25)",
  border: "1px dashed rgba(255, 255, 255, 0.05)",
  borderRadius: "6px",
};