import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToMongoDB } from "db";
import axios from "axios";

export default async function handler(req, res) {
  const { db } = await connectToMongoDB();
  const googleApi = await db.collection("google-api").findOne();

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: googleApi?.clientId,
        clientSecret: googleApi?.clientSecret,
        authorization: {
          params: {
            scope:
              "openid email profile https://www.googleapis.com/auth/adwords",
            access_type: "offline",
            prompt: "consent",
          },
        },
      }),
    ],
    secret: "d226ce13-8d7b-46bc-9661-f9fc2595f064",
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, account, user }) {
        // Persist the OAuth access_token to the token
        if (account) {
          token.accessToken = account.access_token;
          if (account.refresh_token) {
            token.refreshToken = account.refresh_token;
          }
        }
        if (user) {
          token.user = user;
        }
        return token;
      },
      async session({ session, token, user }) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        if (token.refreshToken) {
          session.refreshToken = token.refreshToken;
        }

        return session;
      },
      async signIn({ account }) {
        try {
          await axios.post(
            `${process.env.NEXTAUTH_URL}/api/apis/google/save-session`,
            {
              account,
            }
          );
        } catch (error) {
          console.error("Error creating user on sign-in:", error);
        }
        return true;
      },
    },
  });
}
