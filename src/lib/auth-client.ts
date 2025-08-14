"use client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const { signIn, signOut, signUp, useSession, revokeSessions } =
  createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
    baseURL: process.env.BETTER_AUTH_URL,
  });
