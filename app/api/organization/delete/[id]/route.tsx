import { NextResponse } from "next/server";
import { prisma } from "@/prisma/src/index";
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { params } = context;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Organization id is required" },
        { status: 400 }
      );
    }

    const deletedOrganization = await prisma.organization.delete({
      where: { id: id },
    });

    return NextResponse.json(deletedOrganization, { status: 200 });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}


