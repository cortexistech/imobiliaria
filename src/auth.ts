import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const id = user?.id ?? token.sub;
      if (!id) return { expired: true };

      const dbUser = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          role: true,
          tenantId: true,
          phone: true,
          name: true,
          email: true,
        },
      });

      if (!dbUser) return { expired: true };

      return {
        ...token,
        sub: dbUser.id,
        role: dbUser.role,
        tenantId: dbUser.tenantId,
        phone: dbUser.phone,
        name: dbUser.name,
        email: dbUser.email,
        expired: false,
      };
    },
    async session({ session, token }) {
      if (token.expired || !token.sub || !token.tenantId) {
        return { ...session, user: undefined as never };
      }
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as typeof session.user.role;
        session.user.tenantId = String(token.tenantId);
        session.user.phone = String(token.phone ?? "");
        session.user.name = String(token.name ?? session.user.name);
        session.user.email = String(token.email ?? session.user.email);
      }
      return session;
    },
  },
});
