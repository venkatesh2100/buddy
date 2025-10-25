-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER', 'COORDINATOR');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasicDetails" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "primaryAdminName" TEXT NOT NULL,
    "supportEmail" TEXT,
    "alternativePhoneNumber" TEXT,
    "maxActiveCoordinators" INTEGER NOT NULL DEFAULT 5,
    "websiteUrl" TEXT,
    "languagePreference" TEXT NOT NULL DEFAULT 'English',
    "timeCommonName" TEXT NOT NULL DEFAULT 'India Standard Time',
    "region" TEXT NOT NULL DEFAULT 'Asia/Colombo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_mail_key" ON "Organization"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_contact_key" ON "Organization"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "BasicDetails_organizationId_key" ON "BasicDetails"("organizationId");

-- AddForeignKey
ALTER TABLE "BasicDetails" ADD CONSTRAINT "BasicDetails_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
