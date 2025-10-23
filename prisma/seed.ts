import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
   await prisma.organization.create({
    data: {
      name: "Pragati Engineering College",
      slug: "pragati-engineering-college",
      mail: "support@pec.edu",
      contact: "9876543210",
      status: "ACTIVE",
      avatarUrl:"https://res.cloudinary.com/drxpanhfv/image/upload/v1761215103/Screenshot-8238785337_z19hlg.png",

      basicDetails: {
        create: {
          primaryAdminName: "venky",
          supportEmail: "support@pec.edu",
          alternativePhoneNumber: "9123456780",
          maxActiveCoordinators: 5,
          websiteUrl: "www.pec.edu",
          languagePreference: "EN",
          timeCommonName: "Asia/Kolkata",
          region: "Asia/Kolkata",
        },
      },

      users: {
        create: [
          {
            name: "Venky",
            role: "ADMIN",
          },
          {
            name: "Sai",
            role: "COORDINATOR",
          },
          {
            name: "Mahesh",
            role: "MEMBER",
          },
        ],
      },
    },
    include:{
      basicDetails:true,
      users:true
    }
  });
}

main()
  .then(() => console.log(" Seed completed"))
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
