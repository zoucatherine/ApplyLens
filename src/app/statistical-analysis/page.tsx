// src/app/statistical-analysis/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/types";
import FunnelChart from "./FunnelChart";
import StatsCards from "./StatsCards";
import { SOURCE_LABELS, ApplicationSource } from "@/types";

const UNDECIDED: ApplicationStatus[] = ["WISHLIST", "APPLIED", "PHONE_SCREEN", "INTERVIEW"] as ApplicationStatus[];
const DECIDED: ApplicationStatus[] = ["OFFER", "REJECTED", "WITHDRAWN"] as ApplicationStatus[];
// Any status that means they actually heard back (not ghosted/wishlist)
const RESPONDED: ApplicationStatus[] = ["PHONE_SCREEN", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"] as ApplicationStatus[];

export default async function StatisticalAnalysisPage() {
  const applications = await prisma.application.findMany();

  const total = applications.length;
  const undecided = applications.filter((a) => UNDECIDED.includes(a.status as ApplicationStatus)).length;
  const decided = applications.filter((a) => DECIDED.includes(a.status as ApplicationStatus)).length;
  const offer = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const withdrawn = applications.filter((a) => a.status === "WITHDRAWN").length;
  const wishlist = applications.filter((a) => a.status === "WISHLIST").length;
  const appliedCount = applications.filter((a) => a.status === "APPLIED").length;
  const phoneScreen = applications.filter((a) => a.status === "PHONE_SCREEN").length;
  const interview = applications.filter((a) => a.status === "INTERVIEW").length;

  // Response rate: apps that got any response / apps that were actually submitted (exclude wishlist)
  const submitted = total - wishlist;
  const responded = applications.filter((a) => RESPONDED.includes(a.status as ApplicationStatus)).length;
  const responseRate = submitted > 0 ? Math.round((responded / submitted) * 100) : null;

  // Decision rate: decided / total
  const decisionRate = total > 0 ? Math.round((decided / total) * 100) : null;

  // Top source: most common non-null source value
  const sourceCounts = applications.reduce((acc, a) => {
    const src = (a as any).source as string | null;
    if (src) acc[src] = (acc[src] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSourceKey = Object.keys(sourceCounts).length > 0
    ? Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0][0] as ApplicationSource
    : null;
  const topSource = topSourceKey ? SOURCE_LABELS[topSourceKey] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Statistical Analysis</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 4, marginBottom: "2rem" }}>
        How your applications are tracking, decided vs still in progress.
      </p>

      <StatsCards
        total={total}
        responseRate={responseRate}
        decisionRate={decisionRate}
        topSource={topSource}
      />

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "1.5rem",
        }}
      >
        <FunnelChart counts={{ total, undecided, decided, offer, rejected, withdrawn, undecidedBreakdown: { wishlist, applied: appliedCount, phoneScreen, interview } }} />
      </div>
    </div>
  );
}