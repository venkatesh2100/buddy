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
    // console.log(organization);
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


export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { params } = context;
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Organization slug is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      mail,
      contact,
      website,
      primaryAdmin,
      alterNativePhoneNumber,
      supportEmail,
      timezoneCommonName,
      timezoneRegion,
      language,
      maxCoordinators,
    } = body;

    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
      include: { basicDetails: true },
    });

    if (!existingOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // 1️⃣ Update Organization core details
    const updatedOrg = await prisma.organization.update({
      where: { slug },
      data: {
        name,
        mail,
        contact,
      },
      include: { basicDetails: true },
    });

// 2️⃣ Update or create BasicDetails
const updatedBasicDetails = await prisma.basicDetails.upsert({
  where: { organizationId: existingOrg.id },
  update: {
    primaryAdminName: primaryAdmin,
    supportEmail,
    alternativePhoneNumber: alterNativePhoneNumber,
    websiteUrl: website,
    languagePreference: language || "English",
    timeCommonName: timezoneCommonName || "India Standard Time",
    region: timezoneRegion || "Asia/Colombo",
    maxActiveCoordinators:
      Number.isFinite(Number(maxCoordinators)) && Number(maxCoordinators) > 0
        ? Number(maxCoordinators)
        : 5,
  },
  create: {
    organization: { connect: { id: existingOrg.id } },
    primaryAdminName: primaryAdmin,
    supportEmail,
    alternativePhoneNumber: alterNativePhoneNumber,
    websiteUrl: website,
    languagePreference: language || "English",
    timeCommonName: timezoneCommonName || "India Standard Time",
    region: timezoneRegion || "Asia/Colombo",
    maxActiveCoordinators:
      Number.isFinite(Number(maxCoordinators)) && Number(maxCoordinators) > 0
        ? Number(maxCoordinators)
        : 5,
  },
});

    return NextResponse.json({
      message: "Organization and BasicDetails updated successfully",
      data: { ...updatedOrg, basicDetails: updatedBasicDetails },
    });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 }
    );
  }
}
