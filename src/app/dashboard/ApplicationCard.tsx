// src/app/dashboard/ApplicationCard.tsx
"use client";

import { PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  WISHLIST: { bg: "rgba(234, 179, 8, 0.15)", border: "rgba(234, 179, 8, 0.3)", text: "#fde047" },
  APPLIED: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", text: "#93c5fd" },
  PHONE_SCREEN: { bg: "rgba(168, 85, 247, 0.15)", border: "rgba(168, 85, 247, 0.3)", text: "#d8b4fe" },
  INTERVIEW: { bg: "rgba(249, 115, 22, 0.15)", border: "rgba(249, 115, 22, 0.3)", text: "#fdba74" },
  OFFER: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#86efac" },
  REJECTED: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#fca5a5" },
  WITHDRAWN: { bg: "rgba(107, 114, 128, 0.15)", border: "rgba(107, 114, 128, 0.3)", text: "#d1d5db" },
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

export default function ApplicationCard({ app }: { app: Application }) {
  const statusTheme = STATUS_COLORS[app.status] || STATUS_COLORS.APPLIED;
  const formattedDate = app.appliedDate 
    ? new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div style={cardStyle}>
      {/* Header: Company & Status Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{app.company}</h3>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)" }}>{app.role}</p>
        </div>
        <span 
          style={{
            padding: "0.25rem 0.6rem",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: statusTheme.bg,
            border: `1px solid ${statusTheme.border}`,
            color: statusTheme.text,
            whiteSpace: "nowrap"
          }}
        >
          {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS] || app.status}
        </span>
      </div>

      {/* Details Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "1rem", fontSize: "0.825rem", color: "rgba(255, 255, 255, 0.5)" }}>
        {app.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>📍</span> {app.location}
          </div>
        )}
        {formattedDate && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>📅</span> Applied: {formattedDate}
          </div>
        )}
      </div>

      {/* Notes Preview */}
      {app.notes && (
        <div style={notesPreviewStyle}>
          {app.notes}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "12px",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.15s ease, border-color 0.15s ease",
};

const notesPreviewStyle: React.CSSProperties = {
  marginTop: "1rem",
  paddingTop: "0.75rem",
  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
  fontSize: "0.8rem",
  color: "rgba(255, 255, 255, 0.4)",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "orient",
  overflow: "hidden",
};