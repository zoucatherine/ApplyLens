// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApplyLens",
  description: "Track every application, follow-up, and outcome in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const showNav = pathname !== "/";

  return (
    <html lang="en">
      <body className={inter.className}>
        {showNav && <Navbar />}
        <main style={{ paddingTop: showNav ? 56 : 0 }}>
          {children}
        </main>
      </body>
    </html>
  );
}