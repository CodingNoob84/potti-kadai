import { db } from "@/db/drizzle";

import { authschema } from "@/db/schema/auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authschema,
  }),
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
});
