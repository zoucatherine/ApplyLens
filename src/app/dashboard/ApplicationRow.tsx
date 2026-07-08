// src/app/dashboard/ApplicationRow.tsx
"use client";

import { useRouter } from "next/navigation";
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
  currentFilters: Record<string, string>;
};



export default function ApplicationRow({ app, currentFilters }: Props) {
  const router = useRouter();
  
  const formatDate = (dateVal: Date | string | null) => {
    if (!dateVal) return "—";
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  };

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

  // Generate target edit string token parameter map
  const editUrl = `/dashboard?${new URLSearchParams({ ...currentFilters, edit: app.id }).toString()}`;

  const handleRowClick = () => {
    // Force a strict soft-navigation refresh state change
    router.push(editUrl);
    
    // If Next.js micro-task routing gets caught in an edge-case cache, 
    // router.refresh() forces the surrounding Server Component page to pull fresh database status parameters
    setTimeout(() => {
      router.refresh();
    }, 50);
  };

  return (
    <>
      <style>{`
        .dashboard-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .dashboard-row:hover {
          background: rgba(255, 255, 255, 0.02);
          transform: translateX(2px);
        }
        .row-actions-wrapper {
          opacity: 0;
          display: inline-flex;
          gap: 0.35rem;
          transition: opacity 0.2s ease;
        }
        .dashboard-row:hover .row-actions-wrapper {
          opacity: 1;
        }
        .row-action-btn-icon {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .action-delete:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>

      <tr className="dashboard-row" onClick={handleRowClick}>
        <td style={{ padding: "0.95rem 1rem", fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
          {app.company}
        </td>

        <td style={{ padding: "0.95rem 1rem", fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.65)" }}>
          {app.role}
        </td>

        <td>
          <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: 6, background: currentStyle.bg, color: currentStyle.text, border: `1px solid ${currentStyle.bg}` }}>
            {STATUS_LABELS[app.status as ApplicationStatus] || app.status}
          </span>
        </td>

        <td style={{ padding: "0.95rem 1rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)" }}>
          {formatDate(app.appliedDate)}
        </td>

        <td style={{ padding: "0.95rem 1rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)" }}>
          {formatDate(app.followUpDate)}
        </td>

        {/* Action Tray */}
        <td style={{ padding: "0.5rem 1rem", textAlign: "right", verticalAlign: "middle" }}>
          <div className="row-actions-wrapper">
            <button 
              className="row-action-btn-icon action-delete" 
              title="Delete entry"
              onClick={(e) => {
                // e.stopPropagation stops the row click event handler from triggering 
                e.stopPropagation();
                if(confirm("Are you sure you want to delete this application?")) {
                  // Integration execution hook pattern
                }
              }}
            >
              <i className="ti ti-trash" style={{ fontSize: "0.95rem" }} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}