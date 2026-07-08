// src/app/dashboard/StatusDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PIPELINE_STATUSES, STATUS_LABELS } from "@/types";

// Explicit design tokens matching your image example
const DROPDOWN_COLORS: Record<string, string> = {
  WISHLIST: "#eab308",     // Gold/Yellow for Draft/Wishlist
  APPLIED: "#3b82f6",      // Blue
  PHONE_SCREEN: "#a855f7", // Purple
  INTERVIEW: "#f97316",    // Orange
  OFFER: "#22c55e",        // Green
  REJECTED: "#ef4444",     // Pinkish/Red
  WITHDRAWN: "#6b7280",    // Gray
};

type Props = {
  defaultValue: string;
};

export default function StatusDropdown({ defaultValue }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the animated popup list gracefully if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update URL parameters natively on element select
  const handleSelect = (statusValue: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (!statusValue) {
      current.delete("status");
    } else {
      current.set("status", statusValue);
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    setIsOpen(false);
    router.push(`/dashboard${query}`);
  };

  const currentLabel = defaultValue ? STATUS_LABELS[defaultValue as any] : "All statuses";

  return (
    <div ref={containerRef} style={{ position: "relative", zIndex: 50 }}>
      {/* Trigger Button Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "0 1rem",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.9rem",
          fontWeight: 500,
          cursor: "pointer",
          minWidth: "170px",
          userSelect: "none"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {defaultValue && (
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: DROPDOWN_COLORS[defaultValue] || "#fff" }} />
          )}
          {currentLabel}
        </span>
        {/* Animated Chevron indicator arrow */}
        <span style={{ 
          fontSize: "0.75rem", 
          color: "var(--text-muted)",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease"
        }}>
          ▼
        </span>
      </div>

      {/* Dynamic Popover List Container with Scaling & Opacity Animations */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          background: "#1e1e24", // Deep matching dark surface theme color
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 12,
          padding: "6px",
          minWidth: "200px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          
          // CSS Animation Rules matching the target dynamic pop feel
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.95)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          transformOrigin: "top left",
        }}
      >
        {/* Option: All Statuses */}
        <div
          onClick={() => handleSelect("")}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.6rem 0.75rem",
            borderRadius: 8,
            fontSize: "0.9rem",
            color: !defaultValue ? "var(--text)" : "#9ca3af",
            cursor: "pointer",
            fontWeight: !defaultValue ? 600 : 400,
            background: "transparent",
          }}
          className="dropdown-item-hover"
        >
          <span style={{ width: "18px", fontSize: "0.85rem", display: "inline-block" }}>
            {!defaultValue && "✓"}
          </span>
          All statuses
        </div>

        {/* Mapped Application Status Options */}
        {PIPELINE_STATUSES.map((status) => {
          const isSelected = defaultValue === status;
          return (
            <div
              key={status}
              onClick={() => handleSelect(status)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.75rem",
                borderRadius: 8,
                fontSize: "0.9rem",
                color: isSelected ? "var(--text)" : "#d1d5db",
                cursor: "pointer",
                fontWeight: isSelected ? 500 : 400,
              }}
              className="dropdown-item-hover"
            >
              {/* Dynamic Checkmark or Spacing Alignment container */}
              <span style={{ width: "14px", fontSize: "0.85rem", display: "inline-flex", alignmentBaseline: "center" }}>
                {isSelected && "✓"}
              </span>
              
              {/* Colored Indicator Dot matching Status parameters */}
              <span style={{ 
                width: 7, 
                height: 7, 
                borderRadius: "50%", 
                background: DROPDOWN_COLORS[status] || "var(--text-muted)",
                display: "inline-block"
              }} />
              
              {STATUS_LABELS[status]}
            </div>
          );
        })}
      </div>
    </div>
  );
}