"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWallet() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  let wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
      },
      include: {
        transactions: true
      }
    });
  }

  return wallet;
}

export async function simulateTopUp(amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet) throw new Error("Wallet not found");

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: "DEPOSIT",
        status: "COMPLETED",
      }
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: wallet.balance + amount }
    })
  ]);

  revalidatePath("/dashboard/wallet");
  return { success: true };
}
