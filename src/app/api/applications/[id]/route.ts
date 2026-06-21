// src/app/api/applications/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const application = await prisma.application.findUnique({
    where: { id: params.id },
  });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

// PATCH /api/applications/:id — update an application (status, notes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = ApplicationSchema.partial().parse(body);

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...validated,
        jobUrl: validated.jobUrl || null,
        followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("PATCH /api/applications/:id error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

// DELETE /api/applications/:id — delete an application
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.application.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/applications/:id error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
