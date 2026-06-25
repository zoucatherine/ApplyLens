"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Statistics", href: "/statistical-analysis" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close drawer on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 1.5rem",
          justifyContent: "space-between",
          transition: "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
          background: scrolled
            ? "rgba(91, 33, 182, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
        }}
      >
        {/* Left — Logo */}
        <Link
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
          }}
        >
          ApplyLens
        </Link>

        {/* Center — Desktop nav links */}
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="nav-desktop"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  transition: "color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right — Profile + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

          {/* Profile stub — desktop only */}
          <div className="nav-desktop">
            <div
              title="Profile (coming soon)"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.15)",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              U
            </div>
          </div>

          {/* Hamburger — mobile only */}
          <div className="nav-mobile">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
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
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: 22,
                    height: 2,
                    background: "#fff",
                    borderRadius: 2,
                    transition: "transform 0.25s ease, opacity 0.25s ease",
                    transform:
                      menuOpen
                        ? i === 0
                          ? "translateY(7px) rotate(45deg)"
                          : i === 2
                          ? "translateY(-7px) rotate(-45deg)"
                          : "scaleX(0)"
                        : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          right: 0,
          zIndex: 49,
          background: "rgba(30, 10, 60, 0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: menuOpen ? "1rem 1.5rem 1.5rem" : "0 1.5rem",
          maxHeight: menuOpen ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, padding 0.3s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "0.75rem 0.85rem",
                  borderRadius: 8,
                  fontSize: "1rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  background: active ? "rgba(124, 58, 237, 0.3)" : "transparent",
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
              >
                {label}
              </Link>
            );
          })}

          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0.5rem 0" }} />

          {/* Profile row in mobile drawer */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.85rem" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              U
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>Profile</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)" }}>Coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for desktop/mobile visibility */}
      <style>{`
        .nav-desktop { display: flex !important; align-items: center; }
        .nav-mobile  { display: flex !important; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; flex-direction: column; gap: 5px; }
        }
      `}</style>
    </>
  );
}