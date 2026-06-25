// src/lib/validations.ts

import { z } from "zod";
import { APPLICATION_SOURCES } from "@/types";

export const ApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum([
    "WISHLIST",
    "APPLIED",
    "PHONE_SCREEN",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
  ]),
  appliedDate: z.string().optional(),
  followUpDate: z.string().nullable().optional(),
  decisionDate: z.string().nullable().optional(),
  jobUrl: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  salary: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  source: z.enum(APPLICATION_SOURCES).optional(),
});

export type ApplicationInput = z.infer<typeof ApplicationSchema>;