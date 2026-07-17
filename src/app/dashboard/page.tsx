// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApplicationStatus, STATUS_LABELS } from "@/types";
import ApplicationRow from "./ApplicationRow";
import DashboardControls from "./DashboardControls";

type Props = {
  searchParams: Promise<{
    status?: string;
    sort?: string;
    order?: string;
    search?: string;
    add?: string;
    edit?: string; // Query param to trigger editing modal state
  }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { status: statusParam, sort, order, search, add, edit } = await searchParams;
  const statusFilter = statusParam as ApplicationStatus | undefined;
  const sortField = sort as "company" | "role" | "appliedDate" | "followUpDate" | undefined;
  const sortOrder = order === "asc" ? "asc" : "desc";
  const searchQuery = search?.trim() || "";
  
  const showAddModal = add === "true";
  const editId = edit || null;

  // Fetch target application data if we are editing
  const editingApp = editId 
    ? await prisma.application.findUnique({ where: { id: editId } }) 
    : null;

  const sortFieldMap: Record<string, string> = {
    company: "company",
    role: "role",
    appliedDate: "appliedDate",
    followUpDate: "followUpDate",
  };

  const buildSortUrl = (field: string) => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);
    if (sort === field) {
      params.set("sort", field);
      params.set("order", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "asc");
    }
    return `/dashboard?${params.toString()}`;
  };

  const getCancelUrl = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    const str = params.toString();
    return str ? `/dashboard?${str}` : "/dashboard";
  };

  // Server Action: Handle Creation
  async function handleCreateApplication(formData: FormData) {
    "use server";
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    if (!company || !role) return;

    await prisma.application.create({
      data: {
        company,
        role,
        status: formData.get("status") as string,
        location: (formData.get("location") as string) || null,
        salary: (formData.get("salaryRange") as string) || null,
        jobUrl: (formData.get("jobUrl") as string) || null,
        notes: (formData.get("notes") as string) || null,
        appliedDate: formData.get("appliedDate") ? new Date(formData.get("appliedDate") as string) : new Date(),
        followUpDate: formData.get("followUpDate") ? new Date(formData.get("followUpDate") as string) : null,
      },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  // Server Action: Handle Update Changes
  async function handleUpdateApplication(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    if (!id || !company || !role) return;

    await prisma.application.update({
      where: { id },
      data: {
        company,
        role,
        status: formData.get("status") as string,
        location: (formData.get("location") as string) || null,
        salary: (formData.get("salaryRange") as string) || null,
        jobUrl: (formData.get("jobUrl") as string) || null,
        notes: (formData.get("notes") as string) || null,
        appliedDate: formData.get("appliedDate") ? new Date(formData.get("appliedDate") as string) : new Date(),
        followUpDate: formData.get("followUpDate") ? new Date(formData.get("followUpDate") as string) : null,
      },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { company: { contains: searchQuery, mode: "insensitive" as const } },
            { role: { contains: searchQuery, mode: "insensitive" as const } },
            { notes: { contains: searchQuery, mode: "insensitive" as const } },
            { location: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const applications = await prisma.application.findMany({
    where,
    orderBy: sortField && sortFieldMap[sortField]
      ? { [sortFieldMap[sortField]]: sortOrder }
      : { updatedAt: "desc" },
  });

  return (
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: "2rem 2.5rem" }}>
      
      <style>{`
        .search-container-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.6rem 0.75rem 0.6rem 2.2rem;
          color: #fff;
          font-size: 0.875rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .search-container-input:focus {
          border-color: rgba(124, 58, 237, 0.4);
          box-shadow: 0 0 12px rgba(124, 58, 237, 0.15);
        }
        .th-sort-link {
          color: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: color 0.15s ease;
        }
        .th-sort-link:hover {
          color: #fff;
        }
        .modal-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          color: #fff;
          font-size: 0.875rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .modal-input:focus {
          border-color: #7c3aed;
        }
      `}</style>

      {/* Top Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem", marginTop: 4 }}>
            {statusFilter ? `Showing ${STATUS_LABELS[statusFilter]}` : "All applications"}
            {applications.length > 0 && ` — ${applications.length} result${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        
        <Link
          href={`/dashboard?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(statusFilter ? { status: statusFilter } : {})), add: "true" }).toString()}`}
          style={{
            background: "var(--accent, #7c3aed)",
            color: "#fff",
            padding: "0.6rem 1.25rem",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
          }}
        >
          + Add Application
        </Link>
      </div>

      {/* Control Filters Block */}
        <DashboardControls 
          currentStatus={statusParam || ""}
          currentSort={sort || ""}
          currentOrder={sortOrder}
          searchQuery={searchQuery}
        />

      {/* Main Table Grid View */}
      <div style={{ background: "rgba(20, 15, 35, 0.6)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: 12, overflow: "hidden" }}>
        {applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "rgba(255, 255, 255, 0.35)" }}>
            <i className="ti ti-folder-off" style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }} />
            <p style={{ fontSize: "0.95rem", margin: 0 }}>No entries matching filter view parameters.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", textAlign: "left", background: "rgba(255, 255, 255, 0.01)" }}>
                {[
                  { key: "company", label: "Company", width: "25%" },
                  { key: "role", label: "Role", width: "25%" },
                  { key: "status", label: "Status", width: "20%" },
                  { key: "appliedDate", label: "Applied", width: "15%" },
                  { key: "followUpDate", label: "Follow-up", width: "15%" },
                  { key: "", label: "", width: "50px" }, 
                ].map((col) => (
                  <th key={col.key} style={{ padding: "1rem", color: "rgba(255, 255, 255, 0.45)", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em", width: col.width }}>
                    {col.label}
                    {sortField === col.key && (
                      <span style={{ color: "#7c3aed", marginLeft: "0.35rem", fontSize: "0.65rem" }}>
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <ApplicationRow 
                  key={`${app.id}-${editId}`} // <-- Changing the key forces a partial row state recalculation when editId shifts
                  app={app} 
                  currentFilters={{
                    status: statusParam || "",
                    search: search || "",
                    sort: sort || "",
                    order: order || "",
                  }} 
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ========================================================= */}
      {/* GLASSMORPHIC INTERACTIVE OVERLAY MODAL WITH ANIMATION      */}
      {/* ========================================================= */}
      {(showAddModal || editingApp) && (
        <div 
          className="modal-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(10, 7, 18, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
        >
          <div 
            className="modal-panel"
            style={{
              background: "rgba(20, 16, 33, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              width: "100%",
              maxWidth: "640px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.05)",
              padding: "2rem",
              boxSizing: "border-box"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                  {editingApp ? "Edit Application Context" : "Track New Application"}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", margin: "4px 0 0 0" }}>
                  {editingApp ? "Modify tracking values or metrics parameters." : "Log system keywords to profile custom tracks."}
                </p>
              </div>
              <Link href={getCancelUrl()} style={{ textDecoration: "none", color: "rgba(255,255,255,0.3)", fontSize: "1.2rem" }}>✕</Link>
            </div>

            <form action={editingApp ? handleUpdateApplication : handleCreateApplication} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {editingApp && <input type="hidden" name="id" value={editingApp.id} />}
              
              {/* Row 1: Company + Role */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={modalLabelStyle}>Company *</label>
                  <input type="text" name="company" required defaultValue={editingApp?.company || ""} placeholder="Acme Corp" className="modal-input" />
                </div>
                <div>
                  <label style={modalLabelStyle}>Role *</label>
                  <input type="text" name="role" required defaultValue={editingApp?.role || ""} placeholder="Software Engineer" className="modal-input" />
                </div>
              </div>

              {/* Row 2: Status + Location */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={modalLabelStyle}>Status</label>
                  <select name="status" className="modal-input" defaultValue={editingApp?.status || "APPLIED"}>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key} style={{ background: "#141021" }}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={modalLabelStyle}>Location</label>
                  <input type="text" name="location" defaultValue={editingApp?.location || ""} placeholder="Remote / NYC" className="modal-input" />
                </div>
              </div>

              {/* Row 3: Applied Date + Follow Up Date */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={modalLabelStyle}>Applied Date</label>
                  <input 
                    type="date" 
                    name="appliedDate" 
                    defaultValue={editingApp ? new Date(editingApp.appliedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} 
                    className="modal-input" 
                  />
                </div>
                <div>
                  <label style={modalLabelStyle}>Follow-Up Reminder</label>
                  <input 
                    type="date" 
                    name="followUpDate" 
                    defaultValue={editingApp?.followUpDate ? new Date(editingApp.followUpDate).toISOString().split('T')[0] : ""} 
                    className="modal-input" 
                  />
                </div>
              </div>

              {/* Row 4: Salary Range + Job URL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={modalLabelStyle}>Salary Range</label>
                  <input type="text" name="salary" defaultValue={editingApp?.salary || ""} placeholder="e.g. $120k–$150k" className="modal-input" />
                </div>
                <div>
                  <label style={modalLabelStyle}>Job URL</label>
                  <input type="url" name="jobUrl" defaultValue={editingApp?.jobUrl || ""} placeholder="https://..." className="modal-input" />
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label style={modalLabelStyle}>Notes</label>
                <textarea 
                  name="notes" 
                  rows={3} 
                  defaultValue={editingApp?.notes || ""}
                  placeholder="Recruiter context, referral tracking or tech parameters..." 
                  className="modal-input" 
                  style={{ resize: "none", fontFamily: "inherit" }}
                />
              </div>

              {/* Controls */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <Link href={getCancelUrl()} style={cancelBtnStyle}>Cancel</Link>
                <button type="submit" style={saveBtnStyle}>
                  {editingApp ? "Save Changes" : "Save Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalLabelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.4)", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.03em"
};
const cancelBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", padding: "0.6rem 1.25rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none"
};
const saveBtnStyle: React.CSSProperties = {
  background: "#7c3aed", border: "none", color: "#fff", padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)"
};