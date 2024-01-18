import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter"

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import bcrypt from 'bcryptjs';

export const authOptions = {
    // adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            authorize: async (credentials) => {
                try {
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username },
                    });

                    if (user && bcrypt.compareSync(credentials.password, user.password)) {
                        return {
                            id: user.user_id,
                            name: user.username
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            }
        }),
        GoogleProvider({
            name: "google",
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // console.log(token);
            token = {
                ...token,
                sub: parseInt(token.sub)
            }
            return token;
        },
        async session(session) {
            // console.log(session);
            return session;
        },

        // async jwt({ token, user }) {
        //     user && (token.user = user)
        //     return Promise.resolve(token);
        // },
        // async session(session) {
        //     session.user = token.user;
        //     return Promise.resolve(session);
        // },

        // async signIn({ account, profile }) {
        //     // if (account.provider === "google") {
        //     //     console.log("passs");
        //     //     return profile.email_verified
        //     // }
        //     return true;
        // },
    },

    secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions);

