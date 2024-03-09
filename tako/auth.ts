import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db";
import env from "@/env";

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [
        Google({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
        maxAge: 60 * 60 * 24 * 30,
    },
    callbacks: {
        // @ts-ignore
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
});
