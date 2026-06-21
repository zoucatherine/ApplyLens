"use client";

import { ApplicationStatus, STATUS_COLORS, STATUS_LABELS } from "@/types";

type Props = {
  app: {
    id: string;
    company: string;
    role: string;
    status: string;
    appliedDate: Date | string;
    followUpDate: Date | string | null;
  };
};

export default function ApplicationRow({ app }: Props) {
  return (
    <tr
      style={{
        cursor: "pointer",
        transition: "background 0.15s",
        borderBottom: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
      onClick={() => (window.location.href = `/applications/${app.id}/edit`)}
    >
      <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>{app.company}</td>
      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)" }}>{app.role}</td>
      <td style={{ padding: "0.85rem 1rem" }}>
        <span
          style={{
            background: STATUS_COLORS[app.status as ApplicationStatus] + "22",
            color: STATUS_COLORS[app.status as ApplicationStatus],
            padding: "0.2rem 0.6rem",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          {STATUS_LABELS[app.status as ApplicationStatus]}
        </span>
      </td>
      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        {new Date(app.appliedDate).toLocaleDateString()}
      </td>
      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        {app.followUpDate ? new Date(app.followUpDate).toLocaleDateString() : "—"}
      </td>
    </tr>
  );
}