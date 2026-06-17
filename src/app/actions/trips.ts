"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMyTrips() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  // Viajes como pasajero
  const passengerBookings = await prisma.booking.findMany({
    where: { passengerId: user.id },
    include: {
      ride: {
        include: {
          driver: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Viajes como conductor
  const driverRides = await prisma.ride.findMany({
    where: { driverId: user.id },
    include: {
      bookings: {
        include: {
          passenger: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return { passengerBookings, driverRides, userId: user.id };
}

export async function confirmPassengerQr(bookingId: string, qrCode: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { ride: true }
  });

  if (!booking) throw new Error("Reserva no encontrada");
  if (booking.qrCode !== qrCode) throw new Error("Código QR inválido");
  if (booking.status === "SCANNED") throw new Error("El código QR ya fue escaneado");

  // Transacción financiera
  const passengerWallet = await prisma.wallet.findUnique({ where: { userId: booking.passengerId } });
  const driverWallet = await prisma.wallet.findUnique({ where: { userId: booking.ride.driverId } });

  if (!passengerWallet || passengerWallet.balance < booking.ride.price) {
    throw new Error("El pasajero no tiene saldo suficiente en la billetera");
  }

  if (!driverWallet) {
    throw new Error("La billetera del conductor no está configurada");
  }

  // Ejecutamos todo en una transacción atómica
  await prisma.$transaction([
    // Descontar saldo al pasajero
    prisma.wallet.update({
      where: { id: passengerWallet.id },
      data: { balance: passengerWallet.balance - booking.ride.price }
    }),
    prisma.transaction.create({
      data: {
        walletId: passengerWallet.id,
        amount: booking.ride.price,
        type: "PAYMENT_ESCROW",
        status: "COMPLETED",
        bookingId: booking.id
      }
    }),
    // Acreditar saldo al conductor
    prisma.wallet.update({
      where: { id: driverWallet.id },
      data: { balance: driverWallet.balance + booking.ride.price }
    }),
    prisma.transaction.create({
      data: {
        walletId: driverWallet.id,
        amount: booking.ride.price,
        type: "PAYMENT_RELEASED",
        status: "COMPLETED"
      }
    }),
    // Actualizar estado de reserva
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: "SCANNED" }
    })
  ]);

  revalidatePath("/dashboard/trips");
  revalidatePath("/dashboard/wallet");
  return { success: true };
}
