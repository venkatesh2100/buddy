import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: {params:Promise<{slug:string}>}) {
  try {
    const { params } = context;
    const { slug } = await params;
    const body = await request.json();
    const { avatarUrl } = body;

    if (!avatarUrl) {
      return NextResponse.json({ error: "Missing avatar URL" }, { status: 400 });
    }

    const updatedOrg = await prisma.organization.update({
      where: { slug },
      data: { avatarUrl },
    });

    return NextResponse.json({ success: true, data: updatedOrg });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
