"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApplicationStatus, PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

const inputStyle = {
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "0.6rem 0.85rem",
  color: "var(--text)",
  fontSize: "0.9rem",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  color: "var(--text-muted)",
  marginBottom: 6,
  fontWeight: 500,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export default function EditApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "APPLIED" as ApplicationStatus,
    appliedDate: "",
    followUpDate: "",
    decisionDate: "",
    jobUrl: "",
    salary: "",
    location: "",
    notes: "",
    source: "",
  });

  const id = params.id as string;

  // Fetch existing application on mount
  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) throw new Error("Failed to fetch application");
        const data = await res.json();
        setForm({
          company: data.company,
          role: data.role,
          status: data.status,
          appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString().split("T")[0] : "",
          followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString().split("T")[0] : "",
          decisionDate: data.decisionDate ? new Date(data.decisionDate).toISOString().split("T")[0] : "",
          jobUrl: data.jobUrl || "",
          salary: data.salary || "",
          location: data.location || "",
          notes: data.notes || "",
          source: data.source || "",
        });
      } catch (err) {
        setError("Failed to load application");
      } finally {
        setLoading(false);
      }
    }
    fetchApplication();
  }, [id]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update application");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the application for ${form.company || "this company"}? This can't be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete application");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Failed to delete. Please try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Edit Application
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.9rem" }}>
        Update your job application details.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Company + Role */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Company *</label>
            <input style={inputStyle} value={form.company} onChange={set("company")} placeholder="Acme Corp" required />
          </div>
          <div>
            <label style={labelStyle}>Role *</label>
            <input style={inputStyle} value={form.role} onChange={set("role")} placeholder="Software Engineer" required />
          </div>
        </div>

        {/* Status + Location */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={set("status")}>
              {PIPELINE_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={set("location")} placeholder="Remote / NYC" />
          </div>
        </div>

        {/* Applied date + Follow-up */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Applied Date</label>
            <input style={inputStyle} type="date" value={form.appliedDate} onChange={set("appliedDate")} />
          </div>
          <div>
            <label style={labelStyle}>Follow-up Reminder</label>
            <input style={inputStyle} type="date" value={form.followUpDate} onChange={set("followUpDate")} />
          </div>
        </div>

        {/* Decision Date + Source */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Decision Date</label>
            <input style={inputStyle} type="date" value={form.decisionDate} onChange={set("decisionDate")} />
          </div>
          <div>
            <label style={labelStyle}>Source</label>
            <input style={inputStyle} value={form.source} onChange={set("source")} placeholder="LinkedIn, Referral, Company site..." />
          </div>
        </div>

        {/* Salary + Job URL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Salary Range</label>
            <input style={inputStyle} value={form.salary} onChange={set("salary")} placeholder="$120k–$150k" />
          </div>
          <div>
            <label style={labelStyle}>Job URL</label>
            <input style={inputStyle} value={form.jobUrl} onChange={set("jobUrl")} placeholder="https://..." />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={form.notes}
            onChange={set("notes")}
            placeholder="Recruiter name, interview notes, referral, anything..."
          />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="submit"
            disabled={saving || deleting}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "0.65rem 1.5rem",
              borderRadius: 8,
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving || deleting}
            style={{
              background: "var(--surface)",
              color: "var(--text-muted)",
              padding: "0.65rem 1.25rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            style={{
              background: "transparent",
              color: "var(--danger)",
              padding: "0.65rem 1.25rem",
              borderRadius: 8,
              border: "1px solid var(--danger)",
              marginLeft: "auto",
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}