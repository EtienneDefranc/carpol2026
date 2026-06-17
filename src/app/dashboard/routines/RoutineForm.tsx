"use client";

import { useState } from "react";
import { createRoutine } from "@/app/actions/routines";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Clock, Users } from "lucide-react";

const DAYS = [
  { id: 1, label: "L" },
  { id: 2, label: "M" },
  { id: 3, label: "X" },
  { id: 4, label: "J" },
  { id: 5, label: "V" },
  { id: 6, label: "S" },
];

export function RoutineForm() {
  const [role, setRole] = useState<"DRIVER" | "PASSENGER">("DRIVER");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState(1.50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (dayId: number) => {
    setDaysOfWeek((prev) => 
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (daysOfWeek.length === 0) return alert("Selecciona al menos un día");
    
    setIsSubmitting(true);
    try {
      await createRoutine({ role, daysOfWeek, origin, destination, departureTime, seats, price });
      // Reset form
      setOrigin("");
      setDestination("");
      setDepartureTime("");
      setDaysOfWeek([]);
      setPrice(1.50);
      alert("Rutina guardada con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la rutina");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-white mb-6">Añadir Nueva Rutina Semanal</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Role Selector */}
        <div className="flex gap-4">
          <Button 
            type="button"
            variant={role === "DRIVER" ? "primary" : "secondary"} 
            className="flex-1"
            onClick={() => setRole("DRIVER")}
          >
            Soy Conductor
          </Button>
          <Button 
            type="button"
            variant={role === "PASSENGER" ? "primary" : "secondary"} 
            className="flex-1"
            onClick={() => setRole("PASSENGER")}
          >
            Soy Pasajero
          </Button>
        </div>

        {/* Days of week */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Días de la semana</label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  daysOfWeek.includes(day.id) 
                    ? "bg-neon-cyan text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              required
              placeholder="Origen (Ej: Urdesa)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-light" />
            <input 
              type="text" 
              required
              placeholder="Destino (Ej: ESPOL)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
            />
          </div>
        </div>

        {/* Time & Seats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="time" 
              required
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none [color-scheme:dark]"
            />
          </div>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="number" 
              required
              min={1}
              max={4}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
              placeholder={role === "DRIVER" ? "Cupos disponibles" : "Cupos requeridos"}
            />
          </div>
        </div>

        {role === "DRIVER" && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Precio por pasajero ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
              <input 
                type="number" 
                required
                min={0}
                step={0.10}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
                placeholder="Ej. 1.50"
              />
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Rutina Semanal"}
        </Button>
      </form>
    </Card>
  );
}
