// src/app/api/applications/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationSchema } from "@/lib/validations";

// GET /api/applications — fetch all applications, newest first
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications — create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ApplicationSchema.parse(body);

    const application = await prisma.application.create({
      data: {
        ...validated,
        jobUrl: validated.jobUrl || null,
        appliedDate: validated.appliedDate ? new Date(validated.appliedDate) : new Date(),
        followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
        decisionDate: validated.decisionDate ? new Date(validated.decisionDate) : null,
        source: validated.source || null,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}