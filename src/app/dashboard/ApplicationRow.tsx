"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation(); // don't trigger the row's navigate-to-edit click

    const confirmed = window.confirm(`Delete the application for ${app.company}?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/applications/${app.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (err) {
      alert("Failed to delete. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <tr
      style={{
        cursor: "pointer",
        transition: "background 0.15s",
        borderBottom: "1px solid var(--border)",
        opacity: deleting ? 0.5 : 1,
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
      <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete application"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "0.3rem 0.5rem",
            borderRadius: 6,
            fontSize: "0.9rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}