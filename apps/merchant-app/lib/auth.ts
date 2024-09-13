import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { NextAuthOptions } from "next-auth";
import { User, Account } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
      async signIn({ user, account }: {
        user: User; // This is the type from `next-auth`
        account: Account | null; // Account might be null
        profile?: any; // `profile` is optional
        email?: { verificationRequest?: boolean }; // `email` is optional
        credentials?: Record<string, any>; // `credentials` is optional
      }) {
        console.log("hi signin")
        if (!user || !user.email) {
          return false;
        }

        const provider = account?.provider === "google" ? "Google" : "Github"; // Handle possible null account

        await db.merchant.upsert({
          select: {
            id: true
          },
          where: {
            email: user.email
          },
          create: {
            email: user.email,
            name: user.name || '', // Handle possible undefined name
            auth_type: provider // Use a prisma type here
          },
          update: {
            name: user.name || '', // Handle possible undefined name
            auth_type: provider // Use a prisma type here
          }
        });

        return true;
      }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret"
}
