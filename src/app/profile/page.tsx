"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";

type TabType = "account" | "search" | "documents";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("account");

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: "2rem 2.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Profile Settings</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem", marginTop: 4 }}>
            Manage your account metadata, professional documents, and system preferences.
          </p>
        </div>
      </div>

      {/* Segmented Horizontal Navigation Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: "0.35rem",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "4px",
          borderRadius: 10,
          marginBottom: "2rem",
          maxWidth: "fit-content",
        }}
      >
        {(["account", "search", "documents"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "rgba(124, 58, 237, 0.35)" : "transparent",
              color: activeTab === tab ? "#fff" : "rgba(255, 255, 255, 0.55)",
              border: activeTab === tab ? "1px solid rgba(167, 139, 250, 0.3)" : "1px solid transparent",
              padding: "0.5rem 1.25rem",
              borderRadius: 8,
              fontSize: "0.875rem",
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.15s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content Panel Card Container */}
      <div
        style={{
          background: "rgba(20, 15, 35, 0.6)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 12,
          padding: "2rem",
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          
          {/* TAB 1: ACCOUNT & IDENTITY */}
          {activeTab === "account" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", fontWeight: 700, color: "#fff"
                }}>U</div>
                <div>
                  <button type="button" style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", padding: "0.4rem 1rem", borderRadius: 6, fontSize: "0.8rem", fontWeight: 500, cursor: "pointer"
                  }}>Change Avatar</button>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: 4 }}>JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" defaultValue="User" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" defaultValue="user@example.com" style={inputStyle} />
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "0.5rem 0" }} />

              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Preferences</h3>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#7c3aed" }} />
                  <span>Remind me 1 day before follow-up target dates are due</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: JOB SEARCH METADATA */}
          {activeTab === "search" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Target Job Roles (Comma Separated)</label>
                <input type="text" defaultValue="Full Stack Engineer, Frontend Developer, React Engineer" style={inputStyle} placeholder="e.g. Software Engineer, Product Manager" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle} >Preferred Location Model</label>
                  <select style={inputStyle} defaultValue="remote">
                    <option value="remote" style={{ background: "#1a1625" }}>Remote</option>
                    <option value="hybrid" style={{ background: "#1a1625" }}>Hybrid</option>
                    <option value="onsite" style={{ background: "#1a1625" }}>On-Site</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Base Salary Target (USD)</label>
                  <input type="text" defaultValue="$120,000 - $140,000" style={inputStyle} placeholder="e.g. $100k - $120k" />
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "0.5rem 0" }} />
              
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: "#7c3aed" }} />
                  <span>Exhaustive filter: auto-archive rejected applications from metrics summaries</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS & LINKS HUB */}
          {activeTab === "documents" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Master Resume Link (Google Drive / Dropbox)</label>
                <input type="url" defaultValue="https://drive.google.com/file/d/example" style={inputStyle} placeholder="https://..." />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input type="url" defaultValue="https://linkedin.com/in/username" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input type="url" defaultValue="https://github.com/username" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Quick Bio / Elevator Pitch (For copy-pasting forms)</label>
                <textarea 
                  rows={4} 
                  defaultValue="Full Stack Engineer with 3+ years of experience specializing in React, Next.js frameworks, TypeScript, and clean database engineering with Prisma." 
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} 
                />
              </div>
            </div>
          )}

          {/* Bottom Action Command Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              type="button"
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)", padding: "0.55rem 1.25rem", borderRadius: 8, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "var(--accent, #7c3aed)", border: "none",
                color: "#fff", padding: "0.55rem 1.5rem", borderRadius: 8, fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)"
              }}
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Design Token Shared UI Styles 
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.45)",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.03em"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  padding: "0.65rem 0.85rem",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border 0.15s ease",
};