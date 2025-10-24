import { NextResponse } from "next/server";
import { prisma } from "@/prisma/src/index";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    );
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        basicDetails: true,
        users: true,
      },
    });
    console.log(organization);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: organization });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}
