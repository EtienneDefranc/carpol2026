import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // @ts-ignore - PrismaAdapter compatibility with NextAuth v4
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Validación exclusiva para cuentas @espol.edu.ec
      if (user.email && user.email.endsWith("@espol.edu.ec")) {
        return true;
      }
      return false; // Deniega el acceso
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    // signIn: '/auth/signin', // Comentado por ahora para usar la de defecto y verificar
  },
};
