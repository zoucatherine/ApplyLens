// src/app/dashboard/StatusDropdown.tsx
"use client";

import { PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

type Props = {
  defaultValue: string;
};

export default function StatusDropdown({ defaultValue }: Props) {
  return (
    <select
      name="status"
      defaultValue={defaultValue}
      onChange={(e) => e.target.form?.submit()} // Safe to use client-side event handlers here!
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
        minWidth: "160px"
      }}
    >
      <option value="">All Statuses</option>
      {PIPELINE_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}