"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function bookSingleTripFromRoutine(routineId: string, travelDateStr: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const passenger = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!passenger) throw new Error("Passenger not found");

  const routine = await prisma.routine.findUnique({ where: { id: routineId } });
  if (!routine || routine.role !== "DRIVER") throw new Error("Invalid routine");

  const travelDate = new Date(travelDateStr);
  const startOfDay = new Date(travelDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(travelDate.setHours(23, 59, 59, 999));

  // Verify if a ride already exists for this driver on this day
  let ride = await prisma.ride.findFirst({
    where: {
      routineId: routine.id,
      departureTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (!ride) {
    // Create the Ride instance based on Routine
    const [hours, minutes] = routine.departureTime.split(":").map(Number);
    const rideDepartureTime = new Date(startOfDay);
    rideDepartureTime.setHours(hours, minutes, 0, 0);

    ride = await prisma.ride.create({
      data: {
        driverId: routine.userId,
        routineId: routine.id,
        origin: routine.origin,
        destination: routine.destination,
        departureTime: rideDepartureTime,
        availableSeats: routine.seats,
        price: routine.price,
      },
    });
  }

  // Check if seats are available
  if (ride.availableSeats <= 0) {
    throw new Error("No hay cupos disponibles para este viaje.");
  }

  // Check if passenger already booked this ride
  const existingBooking = await prisma.booking.findFirst({
    where: { passengerId: passenger.id, rideId: ride.id }
  });
  if (existingBooking) throw new Error("Ya has solicitado cupo para este viaje.");

  // Create Booking
  await prisma.booking.create({
    data: {
      passengerId: passenger.id,
      rideId: ride.id,
      status: "PENDING",
    },
  });

  // Decrease available seats
  await prisma.ride.update({
    where: { id: ride.id },
    data: { availableSeats: ride.availableSeats - 1 },
  });

  revalidatePath("/dashboard/explore");
  return { success: true, rideId: ride.id };
}
