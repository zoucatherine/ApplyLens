// src/app/dashboard/ApplicationRow.tsx
"use client";

import { ApplicationStatus, STATUS_LABELS } from "@/types";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedDate: Date | string;
  followUpDate: Date | string | null;
}

type Props = {
  app: Application;
};

export default function ApplicationRow({ app }: Props) {
  
  // Custom parsing helper for clean visualization
  const formatDate = (dateVal: Date | string | null) => {
    if (!dateVal) return "—";
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  };

  // Status mapping schema to align badge glows with your stats page metrics
  const statusStyles: Record<string, { bg: string; text: string }> = {
    WISHLIST: { bg: "rgba(255, 255, 255, 0.05)", text: "rgba(255, 255, 255, 0.7)" },
    APPLIED: { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6" },
    PHONE_SCREEN: { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b" },
    INTERVIEW: { bg: "rgba(167, 139, 250, 0.15)", text: "#a78bfa" },
    OFFER: { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981" },
    REJECTED: { bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444" },
    WITHDRAWN: { bg: "rgba(255, 255, 255, 0.03)", text: "rgba(255, 255, 255, 0.35)" },
  };

  const currentStyle = statusStyles[app.status] || statusStyles.WISHLIST;

  return (
    <>
      <style>{`
        .dashboard-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .dashboard-row:hover {
          background: rgba(255, 255, 255, 0.015);
          transform: translateX(2px);
        }
        .row-action-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.25);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .row-action-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>

      <tr className="dashboard-row">
        {/* Company Column */}
        <td style={{ padding: "0.95rem 1rem", fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
          {app.company}
        </td>

        {/* Role Column */}
        <td style={{ padding: "0.95rem 1rem", fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.65)" }}>
          {app.role}
        </td>

        {/* Custom Status Pill Tag */}
        <td style={{ padding: "0.95rem 1rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.25rem 0.6rem",
              borderRadius: 6,
              background: currentStyle.bg,
              color: currentStyle.text,
              border: `1px solid ${currentStyle.bg}`,
            }}
          >
            {STATUS_LABELS[app.status as ApplicationStatus] || app.status}
          </span>
        </td>

        {/* Applied Date Column */}
        <td style={{ padding: "0.95rem 1rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)" }}>
          {formatDate(app.appliedDate)}
        </td>

        {/* Follow-up Date Column */}
        <td style={{ padding: "0.95rem 1rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)" }}>
          {formatDate(app.followUpDate)}
        </td>

        {/* Tail End Trash Action Dropdown */}
        <td style={{ padding: "0.95rem 1rem", textAlign: "right" }}>
          <button 
            className="row-action-btn" 
            title="Delete tracking card entry"
            onClick={() => {
              if(confirm("Are you sure you want to delete this application?")) {
                // Inline integration hook pattern
              }
            }}
          >
            <i className="ti ti-trash" style={{ fontSize: "0.95rem" }} />
          </button>
        </td>
      </tr>
    </>
  );
}