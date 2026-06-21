// src/app/statistical-analysis/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/types";
import FunnelChart from "./FunnelChart";

const UNDECIDED: ApplicationStatus[] = ["WISHLIST", "APPLIED", "PHONE_SCREEN", "INTERVIEW"] as ApplicationStatus[];
const DECIDED: ApplicationStatus[] = ["OFFER", "REJECTED", "WITHDRAWN"] as ApplicationStatus[];

export default async function StatisticalAnalysisPage() {
  const applications = await prisma.application.findMany();

  const total = applications.length;
  const undecided = applications.filter((a) => UNDECIDED.includes(a.status as ApplicationStatus)).length;
  const decided = applications.filter((a) => DECIDED.includes(a.status as ApplicationStatus)).length;
  const offer = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const withdrawn = applications.filter((a) => a.status === "WITHDRAWN").length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <Link
        href="/dashboard"
        style={{
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          marginBottom: "1.5rem",
        }}
      >
        ← Back to Dashboard
      </Link>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Statistical Analysis</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 4, marginBottom: "2rem" }}>
        How your applications are tracking, decided vs still in progress.
      </p>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "1.5rem",
        }}
      >
        <FunnelChart counts={{ total, undecided, decided, offer, rejected, withdrawn }} />
      </div>
    </div>
  );
}