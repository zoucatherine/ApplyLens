// src/types/index.ts

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "PHONE_SCREEN"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  followUpDate: string | null;
  decisionDate: string | null;
  jobUrl: string | null;
  salary: string | null;
  location: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST: "#94a3b8",
  APPLIED: "#60a5fa",
  PHONE_SCREEN: "#a78bfa",
  INTERVIEW: "#f59e0b",
  OFFER: "#34d399",
  REJECTED: "#f87171",
  WITHDRAWN: "#6b7280",
};

// Ordered for the pipeline view
export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "WISHLIST",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export const APPLICATION_SOURCES = [
  "LINKEDIN",
  "HANDSHAKE",
  "REFERRAL",
  "COMPANY_WEBSITE",
  "INDEED",
  "CAREER_FAIR",
  "OTHER",
] as const;

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  LINKEDIN: "LinkedIn",
  HANDSHAKE: "Handshake",
  REFERRAL: "Referral",
  COMPANY_WEBSITE: "Company Website",
  INDEED: "Indeed",
  CAREER_FAIR: "Career Fair",
  OTHER: "Other",
};