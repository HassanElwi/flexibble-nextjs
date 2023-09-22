import { NextAuthOptions, User, getServerSession } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { SessionInterface, UserProfile } from "@/common.types";
import { createuser, getUser } from "./graphql.actions";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );

      // #TODO remove console
      console.log(
        "jwt encode",
        `secret: ${secret}`,
        `token: ${{ ...token }}`,
        encodedToken
      );

      return encodedToken;
    },
    decode: ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;

      // #TODO remove console
      console.log(
        "jwt decode",
        `secret: ${secret}`,
        `token: ${token}`,
        decodedToken
      );

      return decodedToken;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try {
        const data = (await getUser(email)) as { user: UserProfile };

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data.user,
          },
        };

        // Return customized session
        return newSession;
      } catch (error) {
        console.log("Error retreiving user data", error);
        return session;
      }
    },
    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const isUserExists = (await getUser(user?.email as string)) as {
          user?: UserProfile;
        };

        // Check user exists or not
        if (!isUserExists.user) {
          await createuser(
            user.name as string,
            user.email as string,
            user.image as string
          );
        }

        return true;
      } catch (error: any) {
        console.log("Error in sing in callback", error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as SessionInterface;
  // #TODO remove console
  console.log("Session getCurrentUser", session);

  return session;
}
