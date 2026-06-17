"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMyRoutines() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return [];

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  return prisma.routine.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRoutine(data: {
  role: "DRIVER" | "PASSENGER";
  daysOfWeek: number[];
  origin: string;
  destination: string;
  departureTime: string;
  seats: number;
  price: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  await prisma.routine.create({
    data: {
      userId: user.id,
      role: data.role,
      daysOfWeek: data.daysOfWeek,
      origin: data.origin,
      destination: data.destination,
      departureTime: data.departureTime,
      seats: data.seats,
      price: data.price,
    },
  });

  revalidatePath("/dashboard/routines");
}

export async function deleteRoutine(routineId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error("User not found");

  const routine = await prisma.routine.findUnique({ where: { id: routineId } });
  if (!routine || routine.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.routine.delete({ where: { id: routineId } });
  revalidatePath("/dashboard/routines");
}
