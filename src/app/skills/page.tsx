"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";

interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "soft-skills";
  proficiency: "Expert" | "Intermediate" | "Beginner";
}

const INITIAL_SKILLS: Skill[] = [
  { id: "1", name: "React / Next.js", category: "frontend", proficiency: "Expert" },
  { id: "2", name: "TypeScript", category: "frontend", proficiency: "Expert" },
  { id: "3", name: "Node.js", category: "backend", proficiency: "Intermediate" },
  { id: "4", name: "Prisma ORM", category: "backend", proficiency: "Intermediate" },
  { id: "5", name: "Git / GitHub", category: "tools", proficiency: "Expert" },
  { id: "6", name: "Tailwind CSS", category: "frontend", proficiency: "Expert" },
];

export default function SkillsInventoryPage() {
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Skill["category"]>("frontend");
  const [newProficiency, setNewProficiency] = useState<Skill["proficiency"]>("Intermediate");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      category: newCategory,
      proficiency: newProficiency,
    };

    setSkills([...skills, newSkill]);
    setNewName("");
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: "2rem 2.5rem" }}>
      {/* Header section */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Skills Inventory</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem", marginTop: 4 }}>
            Manage the technical stack keywords used to tailor your job applications.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
        
        {/* Left Side: Quick Add Form Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0 0 1.25rem 0" }}>Add New Skill</h2>
          <form onSubmit={handleAddSkill} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Skill Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Docker, PostgreSQL"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Skill["category"])}
                style={inputStyle}
              >
                <option value="frontend" style={{ background: "#1a1625" }}>Frontend Development</option>
                <option value="backend" style={{ background: "#1a1625" }}>Backend & Database</option>
                <option value="tools" style={{ background: "#1a1625" }}>Tools & DevOps</option>
                <option value="soft-skills" style={{ background: "#1a1625" }}>Core / Soft Skills</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Proficiency Level</label>
              <select
                value={newProficiency}
                onChange={(e) => setNewProficiency(e.target.value as Skill["proficiency"])}
                style={inputStyle}
              >
                <option value="Expert" style={{ background: "#1a1625" }}>Expert</option>
                <option value="Intermediate" style={{ background: "#1a1625" }}>Intermediate</option>
                <option value="Beginner" style={{ background: "#1a1625" }}>Beginner</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: "var(--accent, #7c3aed)",
                border: "none",
                color: "#fff",
                padding: "0.65rem",
                borderRadius: 8,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "0.5rem",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
              }}
            >
              Add to Inventory
            </button>
          </form>
        </div>

        {/* Right Side: Visual Managed Inventory Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {(["frontend", "backend", "tools", "soft-skills"] as Skill["category"][]).map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            
            // Clean dynamic names for categories
            const displayNames: Record<string, string> = {
              frontend: "Frontend Stack",
              backend: "Backend & System Infrastructure",
              tools: "Developer Tools & Workflow",
              "soft-skills": "Methodologies & Domain Knowledge"
            };

            return (
              <div key={category} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                    {displayNames[category]}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 12 }}>
                    {categorySkills.length} saved
                  </span>
                </div>

                {categorySkills.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                    No items added to this tier yet.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.06)",
                          padding: "0.4rem 0.65rem",
                          borderRadius: 8,
                          fontSize: "0.85rem",
                        }}
                      >
                        <span style={{ color: "#fff", fontWeight: 500 }}>{skill.name}</span>
                        
                        {/* Dynamic Proficiency Tag */}
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          padding: "1px 5px",
                          borderRadius: 4,
                          background: 
                            skill.proficiency === "Expert" ? "rgba(16, 185, 129, 0.15)" : 
                            skill.proficiency === "Intermediate" ? "rgba(59, 130, 246, 0.15)" : 
                            "rgba(245, 158, 11, 0.15)",
                          color: 
                            skill.proficiency === "Expert" ? "#10b981" : 
                            skill.proficiency === "Intermediate" ? "#3b82f6" : 
                            "#f59e0b",
                        }}>
                          {skill.proficiency}
                        </span>

                        {/* Inline Delete Cross Button */}
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "rgba(255,255,255,0.3)",
                            cursor: "pointer",
                            padding: "0 2px",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// Design Token Styles Shared with Layout Themes
const cardStyle: React.CSSProperties = {
  background: "rgba(20, 15, 35, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: 12,
  padding: "1.5rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 500,
  color: "rgba(255, 255, 255, 0.45)",
  marginBottom: "0.4rem",
  textTransform: "uppercase",
  letterSpacing: "0.03em"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  padding: "0.6rem 0.75rem",
  color: "#fff",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
};