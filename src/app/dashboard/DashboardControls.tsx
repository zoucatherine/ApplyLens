// src/app/dashboard/DashboardControls.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

const DROPDOWN_COLORS: Record<string, string> = {
  WISHLIST: "#eab308",
  APPLIED: "#3b82f6",
  PHONE_SCREEN: "#a855f7",
  INTERVIEW: "#f97316",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

// Unified sort options combining field and order direction
const SORT_OPTIONS = [
  { key: "appliedDate-desc", label: "Newest first" },
  { key: "appliedDate-asc", label: "Oldest first" },
  { key: "company-asc", label: "Company A-Z" },
  { key: "company-desc", label: "Company Z-A" },
];

const VIEW_ICONS: Record<string, string> = {
  list: "ti ti-list",
  cards: "ti ti-layout-grid",
  kanban: "ti ti-layout-kanban",
};

type Props = {
  currentStatus: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
  searchQuery: string;
  currentView: "list" | "cards" | "kanban";
};

export default function DashboardControls({
  currentStatus,
  currentSort,
  currentOrder,
  searchQuery,
  currentView,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update parameters natively
  const updateParams = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/dashboard${query}`);
  };

  const currentStatusLabel = currentStatus
    ? STATUS_LABELS[currentStatus as any]
    : "All statuses";

  // Reconstruct the current active sort key from the individual params
  const activeSortKey = currentSort ? `${currentSort}-${currentOrder}` : "";
  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.key === activeSortKey)?.label || "Sort: Default";

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Global CSS Style Tag for Hover Highlights */}
      <style>{`
        .dropdown-item-hover {
          transition: background 0.15s ease, color 0.15s ease;
        }
        .dropdown-item-hover:hover {
          background: rgba(124, 58, 237, 0.15) !important;
          color: #fff !important;
        }
      `}</style>

      <form
        style={{ display: "flex", gap: "0.75rem", width: "100%", alignItems: "center" }}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Search Input Bar */}
        <div style={{ position: "relative", flex: 1 }}>
          <i
            className="ti ti-search"
            style={{
              position: "absolute",
              left: "0.8rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255, 255, 255, 0.3)",
              fontSize: "1rem",
            }}
          />
          <input
            type="search"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search company, role, notes, location..."
            className="search-container-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ search: e.currentTarget.value.trim() });
              }
            }}
          />
        </div>

        {/* --- CUSTOM STATUS DROPDOWN --- */}
        <div ref={statusRef} style={{ position: "relative", zIndex: 50 }}>
          <div onClick={() => setIsStatusOpen(!isStatusOpen)} style={dropdownTriggerStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {currentStatus && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: DROPDOWN_COLORS[currentStatus] || "#fff",
                  }}
                />
              )}
              {currentStatusLabel}
            </span>
            <i
              className="ti ti-chevron-down"
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.4)",
                transform: isStatusOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>

          <div
            style={{
              ...popoverContainerStyle,
              opacity: isStatusOpen ? 1 : 0,
              transform: isStatusOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.95)",
              pointerEvents: isStatusOpen ? "auto" : "none",
            }}
          >
            <div
              onClick={() => {
                updateParams({ status: null });
                setIsStatusOpen(false);
              }}
              style={{
                ...itemStyle,
                fontWeight: !currentStatus ? 600 : 400,
                color: !currentStatus ? "#fff" : "#9ca3af",
              }}
              className="dropdown-item-hover"
            >
              <span style={{ width: "22px", display: "inline-flex", alignItems: "center" }}>
                {!currentStatus && <i className="ti ti-check" style={{ fontSize: "1rem" }} />}
              </span>
              All statuses
            </div>
            {PIPELINE_STATUSES.map((status) => {
              const isSelected = currentStatus === status;
              return (
                <div
                  key={status}
                  onClick={() => {
                    updateParams({ status });
                    setIsStatusOpen(false);
                  }}
                  style={{
                    ...itemStyle,
                    fontWeight: isSelected ? 500 : 400,
                    color: isSelected ? "#fff" : "#d1d5db",
                  }}
                  className="dropdown-item-hover"
                >
                  <span style={{ width: "22px", display: "inline-flex", alignItems: "center" }}>
                    {isSelected && <i className="ti ti-check" style={{ fontSize: "1rem" }} />}
                  </span>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: DROPDOWN_COLORS[status] || "#fff",
                      marginRight: "6px",
                    }}
                  />
                  {STATUS_LABELS[status]}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- CUSTOM SORT DROPDOWN --- */}
        <div ref={sortRef} style={{ position: "relative", zIndex: 50 }}>
          <div onClick={() => setIsSortOpen(!isSortOpen)} style={dropdownTriggerStyle}>
            <span>{currentSortLabel}</span>
            <i
              className="ti ti-chevron-down"
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.4)",
                transform: isSortOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>

          <div
            style={{
              ...popoverContainerStyle,
              right: 0,
              left: "auto",
              opacity: isSortOpen ? 1 : 0,
              transform: isSortOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.95)",
              pointerEvents: isSortOpen ? "auto" : "none",
            }}
          >
            <div
              onClick={() => {
                updateParams({ sort: null, order: null });
                setIsSortOpen(false);
              }}
              style={{
                ...itemStyle,
                fontWeight: !activeSortKey ? 600 : 400,
                color: !activeSortKey ? "#fff" : "#9ca3af",
              }}
              className="dropdown-item-hover"
            >
              <span style={{ width: "22px", display: "inline-flex", alignItems: "center" }}>
                {!activeSortKey && <i className="ti ti-check" style={{ fontSize: "1rem" }} />}
              </span>
              Default Order
            </div>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = activeSortKey === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => {
                    const [sortField, sortDirection] = opt.key.split("-");
                    updateParams({ sort: sortField, order: sortDirection });
                    setIsSortOpen(false);
                  }}
                  style={{
                    ...itemStyle,
                    fontWeight: isSelected ? 500 : 400,
                    color: isSelected ? "#fff" : "#d1d5db",
                  }}
                  className="dropdown-item-hover"
                >
                  <span style={{ width: "22px", display: "inline-flex", alignItems: "center" }}>
                    {isSelected && <i className="ti ti-check" style={{ fontSize: "1rem" }} />}
                  </span>
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- ICON-ONLY VIEW TOGGLE --- */}
        <div
          style={{
            display: "flex",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {(["list", "cards", "kanban"] as const).map((v) => {
            const isActive = currentView === v;
            const viewLabel = `${v.charAt(0).toUpperCase() + v.slice(1)} View`;
            return (
              <button
                key={v}
                type="button"
                onClick={() => updateParams({ view: v })}
                title={viewLabel}
                aria-label={viewLabel}
                style={{
                  background: isActive ? "#7c3aed" : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  border: "none",
                  borderRadius: 6,
                  padding: "0.5rem 0.6rem",
                  fontSize: "1.1rem",
                  lineHeight: 1,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                }}
              >
                <i className={VIEW_ICONS[v]} />
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}

// Layout styling declarations
const dropdownTriggerStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.03)",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  padding: "0 1rem",
  height: "42px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.9rem",
  fontWeight: 500,
  cursor: "pointer",
  minWidth: "160px",
  gap: "1rem",
  userSelect: "none",
};

const popoverContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  background: "#1e1e24",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 12,
  padding: "6px",
  minWidth: "190px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
  transition: "opacity 0.15s ease, transform 0.15s ease",
  transformOrigin: "top left",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0.6rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.875rem",
  cursor: "pointer",
};