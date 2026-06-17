"use server";

import { prisma } from "@/lib/prisma";

import { Prisma } from "@prisma/client";

export type SearchFilters = {
  origin?: string;
  destination?: string;
  dayOfWeek?: number;
};

export async function searchDriverRoutines(filters: SearchFilters) {
  // Construir condiciones de búsqueda dinámicas
  const whereClause: Prisma.RoutineWhereInput = {
    role: "DRIVER",
    isActive: true,
  };

  if (filters.origin) {
    whereClause.origin = {
      contains: filters.origin,
      mode: "insensitive",
    };
  }

  if (filters.destination) {
    whereClause.destination = {
      contains: filters.destination,
      mode: "insensitive",
    };
  }

  if (filters.dayOfWeek !== undefined) {
    // Prisma allows filtering integer arrays using 'has'
    whereClause.daysOfWeek = {
      has: filters.dayOfWeek,
    };
  }

  const routines = await prisma.routine.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          name: true,
          image: true,
          reliability: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Limitar a los 20 más recientes para el prototipo
  });

  return routines;
}
