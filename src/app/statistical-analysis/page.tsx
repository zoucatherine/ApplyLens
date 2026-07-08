import TransitionLink from "@/components/TransitionLink";
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
    <div style={{ maxWidth: 2000, margin: "0 auto", padding: "2rem 2.5rem" }}>
      
      {/* Header with back navigation button matching Profile and Skills pages */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Statistical Analysis</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.875rem", marginTop: 4 }}>
            How your applications are tracking, decided vs still in progress.
          </p>
        </div>
      </div>

      {/* Main Aggregation Cards Layout Group */}
      <div style={{ marginBottom: "2rem" }}>
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
      </div>

      {/* Structured Visual Funnel Panel Card Container */}
      <div
        style={{
          background: "rgba(20, 15, 35, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 12,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>
            Pipeline Conversion Funnel
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "0.78rem", marginTop: 4, marginBottom: 0 }}>
            Visualizing structural conversion and breakdown yield drops across active job stages.
          </p>
        </div>

        <FunnelChart 
          counts={{ 
            total, 
            undecided, 
            decided, 
            offer, 
            rejected, 
            withdrawn, 
            undecidedBreakdown: { 
              wishlist, 
              applied: appliedCount, 
              phoneScreen, 
              interview 
            } 
          }} 
        />
      </div>
    </div>
  );
}