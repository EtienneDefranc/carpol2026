import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const prismaAdapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter: prismaAdapter });

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
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
