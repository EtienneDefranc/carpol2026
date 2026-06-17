"use client";

import { deleteRoutine } from "@/app/actions/routines";
import { Card } from "@/components/ui/Card";
import { Trash2, Clock, MapPin, Users } from "lucide-react";

type Routine = {
  id: string;
  role: string;
  daysOfWeek: number[];
  origin: string;
  destination: string;
  departureTime: string;
  seats: number;
};

const DAY_MAP: Record<number, string> = {
  1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb"
};

export function RoutineList({ routines }: { routines: Routine[] }) {
  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar esta rutina?")) {
      await deleteRoutine(id);
    }
  };

  if (routines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tienes rutinas registradas aún.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {routines.map((routine) => (
        <Card key={routine.id} className="relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full ${routine.role === 'DRIVER' ? 'bg-brand' : 'bg-neon-cyan'}`}></div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${routine.role === 'DRIVER' ? 'bg-brand/20 text-brand-light' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                  {routine.role === 'DRIVER' ? 'CONDUCTOR' : 'PASAJERO'}
                </span>
                <div className="flex gap-1">
                  {routine.daysOfWeek.map(d => (
                    <span key={d} className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                      {DAY_MAP[d]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white font-medium text-lg mt-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {routine.origin} <span className="text-gray-600">→</span> {routine.destination}
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {routine.departureTime}</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {routine.seats} cupos</div>
              </div>
            </div>
            
            <button 
              onClick={() => handleDelete(routine.id)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
