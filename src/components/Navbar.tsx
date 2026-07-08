"use client";

import { useState, useEffect, useRef } from "react";
import TransitionLink from "@/components/TransitionLink";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "ti-layout-dashboard" },
  { label: "Statistics", href: "/statistical-analysis", icon: "ti-chart-sankey" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  const links = (
    <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
      {NAV_LINKS.map(({ label, href, icon }) => {
        const active = pathname === href;
        return (
          <TransitionLink
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              padding: "0.55rem 0.85rem",
              borderRadius: 8,
              fontSize: "0.875rem",
              fontWeight: active ? 600 : 400,
              color: active ? "#fff" : "rgba(255,255,255,0.55)",
              background: active ? "rgba(124,58,237,0.35)" : "transparent",
              textDecoration: "none",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              }
            }}
          >
            <i className={`ti ${icon}`} style={{ fontSize: 17 }} aria-hidden />
            {label}
          </TransitionLink>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.25rem 0.85rem" }}>
      {/* Brand */}
      <TransitionLink
        href="/"
        style={{
          fontWeight: 800,
          fontSize: "1.1rem",
          letterSpacing: "-0.02em",
          textDecoration: "none",
          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "2rem",
          paddingLeft: "0.35rem",
          display: "block",
        }}
      >
        ApplyLens
      </TransitionLink>

      {/* Nav links */}
      {links}

      {/* Bottom: profile */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          padding: "0.65rem 0.5rem",
          borderRadius: 8,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        title="Profile (coming soon)"
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          U
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>Profile</div>
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>Coming soon</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside 
        style={{
          position: "fixed",
          top: 0, left: 0, bottom: 0,
          width: 220,
          background: "rgba(18, 6, 40, 0.97)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          viewTransitionName: "main-sidebar", // FIXED: Prevents desktop view transition flash
        }} 
        className="sidebar-desktop sidebar-container"
      >
        {sidebarInner}
      </aside>

      {/* Mobile topbar */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 52,
        background: "rgba(18, 6, 40, 0.97)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1rem",
      }} className="sidebar-mobile-bar">
        <TransitionLink
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "1.05rem",
            textDecoration: "none",
            background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ApplyLens
        </TransitionLink>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block",
              width: 22,
              height: 2,
              background: "#fff",
              borderRadius: 2,
              transition: "transform 0.25s ease, opacity 0.25s ease",
              transform: mobileOpen
                ? i === 0 ? "translateY(7px) rotate(45deg)"
                : i === 2 ? "translateY(-7px) rotate(-45deg)"
                : "scaleX(0)"
                : "none",
              opacity: mobileOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 48,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
          className="sidebar-mobile-overlay"
        />
      )}

      {/* Mobile drawer (slides in from left) */}
      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 52, bottom: 0, left: 0,
          width: 220,
          background: "rgba(18, 6, 40, 0.98)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          zIndex: 49,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          viewTransitionName: "main-sidebar", // FIXED: Prevents mobile view transition slide/fade anomaly
        }}
        className="sidebar-mobile-drawer sidebar-container"
      >
        {sidebarInner}
      </div>

      <style>{`
        /* Desktop Defaults (Screens wider than 768px) */
        .sidebar-desktop        { display: flex !important; }
        .sidebar-mobile-bar     { display: none !important; }
        .sidebar-mobile-drawer  { display: none !important; }
        .sidebar-mobile-overlay { display: none !important; }

        /* Mobile Adjustments (Screens 768px and narrower) */
        @media (max-width: 768px) {
          .sidebar-desktop        { display: none !important; }
          .sidebar-mobile-bar     { display: flex !important; }
          .sidebar-mobile-drawer  { display: flex !important; }
          .sidebar-mobile-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}