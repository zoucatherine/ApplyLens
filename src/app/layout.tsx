// src/app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import Sidebar from "@/components/Navbar";
import "./globals.css"; // <-- Added to apply your website's theme styles globally

export const metadata: Metadata = {
  title: "ApplyLens",
  description: "Track every application, follow-up, and outcome in one place.",
};

// Changed to an async function to correctly await headers()
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const showNav = pathname !== "/";

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        {showNav && <Sidebar />}
        <main style={{
          marginLeft: showNav ? 220 : 0,
          paddingTop: 0,
        }}>
          {children}
        </main>
        <style>{`
          @media (max-width: 768px) {
            main { margin-left: 0 !important; padding-top: 52px; }
          }
        `}</style>
      </body>
    </html>
  );
}