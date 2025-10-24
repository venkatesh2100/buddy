import { NextResponse } from "next/server";
import { prisma } from "@/prisma/src/index";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const { slug } = await params;

  try {
    if (!slug) {
      return NextResponse.json(
        { error: "Organization slug is required" },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const users = await prisma.user.findMany({
      where: { organizationId: org.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { params } = context;
  const { slug } = await params;
  try {
    if (!slug) {
      return NextResponse.json(
        { error: "Organization slug is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, role } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const org = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        organizationId: org.id,
        name,
        role,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
