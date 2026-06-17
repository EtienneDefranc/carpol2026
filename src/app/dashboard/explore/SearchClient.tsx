"use client";

import { useState, useEffect } from "react";
import { searchDriverRoutines, SearchFilters } from "@/app/actions/explore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Search, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";

type DriverRoutine = Awaited<ReturnType<typeof searchDriverRoutines>>[0];

const DAYS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
];

export function SearchClient() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<DriverRoutine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoutine, setSelectedRoutine] = useState<DriverRoutine | null>(null);
  const [bookingMode, setBookingMode] = useState<"SINGLE" | "ROUTINE" | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  const handleSearch = async (currentFilters: SearchFilters) => {
    setIsLoading(true);
    try {
      const routines = await searchDriverRoutines(currentFilters);
      setResults(routines);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar rutinas iniciales al montar el componente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const load = async () => {
      try {
        const routines = await searchDriverRoutines({});
        setResults(routines);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(filters);
  };

  const handleRequestSeat = async () => {
    if (!selectedRoutine || !bookingMode) return;
    
    setIsBooking(true);
    try {
      if (bookingMode === "SINGLE") {
        if (!selectedDate) {
          alert("Por favor selecciona una fecha para tu viaje.");
          setIsBooking(false);
          return;
        }
        // Validar que la fecha elegida coincida con un día de la rutina
        const dayOfDate = new Date(selectedDate).getDay(); 
        // JS getDay(): 0 = Dom, 1 = Lun, etc. igual que nuestra base
        if (!selectedRoutine.daysOfWeek.includes(dayOfDate)) {
          alert("La fecha seleccionada no coincide con los días en que el conductor hace esta ruta.");
          setIsBooking(false);
          return;
        }

        // Import dinámico de la acción para evitar bugs
        const { bookSingleTripFromRoutine } = await import("@/app/actions/bookings");
        await bookSingleTripFromRoutine(selectedRoutine.id, selectedDate);
        alert("¡Reserva solicitada con éxito! Espera la confirmación del conductor.");
      } else {
        alert("Añadir rutina completa está en desarrollo. ¡Pronto disponible!");
      }

      setSelectedRoutine(null);
      setBookingMode(null);
      setSelectedDate("");
      // Refrescar resultados
      handleSearch(filters);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocurrió un error al reservar");
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Origen..."
              value={filters.origin || ""}
              onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-light" />
            <input 
              type="text" 
              placeholder="Destino..."
              value={filters.destination || ""}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-brand/50 outline-none"
            />
          </div>
          <div className="md:w-48">
            <select 
              value={filters.dayOfWeek ?? ""}
              onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-brand/50 outline-none appearance-none"
            >
              <option value="">Cualquier día</option>
              {DAYS.map(day => (
                <option key={day.id} value={day.id}>{day.label}</option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="primary" className="flex items-center justify-center gap-2">
            <Search className="w-4 h-4" /> Buscar
          </Button>
        </form>
      </Card>

      {/* Results Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Buscando rutinas disponibles...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron conductores con estos criterios.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((routine) => (
            <Card key={routine.id} className="flex flex-col h-full overflow-hidden group border-white/5 hover:border-brand/30 transition-all">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand to-neon-cyan p-[2px]">
                      <div className="w-full h-full bg-black rounded-full overflow-hidden relative">
                        {routine.user.image ? (
                          <Image src={routine.user.image} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                            {routine.user.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{routine.user.name || "Usuario"}</h3>
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <ShieldCheck className="w-3 h-3" /> {routine.user.reliability}% Confianza
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 text-xs px-2 py-1 rounded text-gray-300">
                    {routine.seats} cupos
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                    <span className="truncate">{routine.origin}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-neon-cyan mt-0.5 shrink-0" />
                    <span className="truncate">{routine.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{routine.departureTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {routine.daysOfWeek.map(d => (
                      <span key={d} className="text-[10px] uppercase font-bold tracking-wider bg-white/5 px-2 py-1 rounded text-brand-light">
                        {DAYS.find(day => day.id === d)?.label.slice(0,3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                {selectedRoutine?.id === routine.id ? (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-center text-gray-400 font-medium">¿Cómo deseas viajar?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={bookingMode === 'SINGLE' ? 'primary' : 'secondary'} 
                        className="text-xs py-2 px-0"
                        onClick={() => setBookingMode('SINGLE')}
                      >
                        Solo un viaje
                      </Button>
                      <Button 
                        variant={bookingMode === 'ROUTINE' ? 'primary' : 'secondary'} 
                        className="text-xs py-2 px-0"
                        onClick={() => setBookingMode('ROUTINE')}
                      >
                        Añadir rutina
                      </Button>
                    </div>

                    {bookingMode === 'SINGLE' && (
                      <div className="mt-2">
                        <input 
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:border-brand/50 outline-none [color-scheme:dark]"
                        />
                      </div>
                    )}

                    {bookingMode && (
                      <Button variant="primary" className="w-full text-sm py-2 mt-2" onClick={handleRequestSeat} disabled={isBooking}>
                        {isBooking ? "Procesando..." : "Confirmar Solicitud"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-between group-hover:bg-brand/20 group-hover:text-brand-light transition-colors"
                    onClick={() => {
                      setSelectedRoutine(routine);
                      setBookingMode(null);
                      setSelectedDate("");
                    }}
                  >
                    Solicitar Cupo <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
