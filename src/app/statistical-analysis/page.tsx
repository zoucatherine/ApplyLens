// src/app/statistical-analysis/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/types";
import FunnelChart from "./FunnelChart";
import StatsCards from "./StatsCards";

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
  const wishlist = applications.filter((a) => a.status === "WISHLIST").length;
  const appliedCount = applications.filter((a) => a.status === "APPLIED").length;
  const phoneScreen = applications.filter((a) => a.status === "PHONE_SCREEN").length;
  const interview = applications.filter((a) => a.status === "INTERVIEW").length;

  const totalApps = applications.length;
  const appliedCountForRate = applications.filter(a => a.status !== "WISHLIST" && a.status !== "WITHDRAWN").length;
  const responseCount = applications.filter(a => ["PHONE_SCREEN", "INTERVIEW", "OFFER", "REJECTED"].includes(a.status)).length;
  const interviewCount = applications.filter(a => ["PHONE_SCREEN", "INTERVIEW"].includes(a.status)).length;
  const offerCount = applications.filter(a => a.status === "OFFER").length;

  const responseRate = appliedCountForRate > 0 ? Math.round((responseCount / appliedCountForRate) * 100) : 0;
  const interviewRate = appliedCountForRate > 0 ? Math.round((interviewCount / appliedCountForRate) * 100) : 0;
  const offerRate = appliedCountForRate > 0 ? Math.round((offerCount / appliedCountForRate) * 100) : 0;

  const appsWithDates = applications.filter(a => a.followUpDate || a.decisionDate);
  const avgDaysToResponse = appsWithDates.length > 0
    ? Math.round(appsWithDates.reduce((sum, a) => {
        const applied = new Date(a.appliedDate).getTime();
        const response = new Date(a.followUpDate || (a as any).decisionDate!).getTime();
        return sum + (response - applied) / (1000 * 60 * 60 * 24);
      }, 0) / appsWithDates.length)
    : 0;

  return (
    /* UPDATED: Aligned maxWidth and padding constraints with the main dashboard layout expansion */
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Statistical Analysis</h1>
      <p style={{ color: "var(--text-muted)", marginTop: 4, marginBottom: "2rem" }}>
        How your applications are tracking, decided vs still in progress.
      </p>

      <StatsCards
        totalApps={totalApps}
        responseRate={responseRate}
        appliedCount={appliedCountForRate}
        responseCount={responseCount}
        interviewRate={interviewRate}
        interviewCount={interviewCount}
        offerRate={offerRate}
        offerCount={offerCount}
        avgDaysToResponse={avgDaysToResponse}
        trackedDatesCount={appsWithDates.length}
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