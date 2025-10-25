import { defineConfig, env } from "prisma/config";
if (process.env.NODE_ENV !== "production") {
  // Load .env locally only
  await import("dotenv").then(({ config }) => config());
}


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
