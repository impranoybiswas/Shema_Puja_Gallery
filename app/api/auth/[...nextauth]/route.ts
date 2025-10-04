import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUsersCollection } from "@/app/libs/collection";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email || "";
        token.name = user.name || "";
      }

      try {
        if (token.email) {
          const users = await getUsersCollection();
          const dbUser = await users.findOne({ email: token.email });
          if (dbUser?.role) token.role = dbUser.role;
        }
      } catch (err) {
        console.error("DB fetch failed:", err);
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      const users = await getUsersCollection();

      if (account?.provider === "google") {
        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          await users.insertOne({
            name: user.name,
            email: user.email,
            provider: "google",
            image: user.image,
            role: "user",
            createdAt: new Date().toISOString(),
            lastSignInAt: new Date().toISOString(),
          });
        } else {
          await users.updateOne(
            { _id: existingUser._id },
            { $set: { lastSignInAt: new Date().toISOString() } }
          );
        }
      }

      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
