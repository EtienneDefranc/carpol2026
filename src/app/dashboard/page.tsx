import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Search, Wallet } from "lucide-react";
import { getMyRoutines } from "@/app/actions/routines";
import { getWallet } from "@/app/actions/wallet";
import Link from "next/link";

const DAYS = [
  { id: 1, label: "Lunes" },
  { id: 2, label: "Martes" },
  { id: 3, label: "Miércoles" },
  { id: 4, label: "Jueves" },
  { id: 5, label: "Viernes" },
  { id: 6, label: "Sábado" },
  { id: 0, label: "Domingo" },
];

export default async function DashboardPage() {
  const routines = await getMyRoutines();
  const wallet = await getWallet();

  // Para "Tu próximo viaje", tomaremos la rutina más reciente o relevante como demo.
  // En una versión final, aquí se calcularía la fecha exacta del próximo viaje.
  const nextTrip = routines.length > 0 ? routines[0] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Bienvenido a tu Dashboard</h1>
        <p className="text-gray-400">Aquí tienes un resumen de tus próximas rutas y saldo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximo Viaje */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-neon-cyan" />
            Tu Próximo Viaje (Rutina Activa)
          </h2>
          {nextTrip ? (
            <Card className="bg-gradient-to-r from-brand/20 to-transparent border-brand/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-sm text-brand-light font-medium mb-1">
                    {nextTrip.daysOfWeek.map(d => DAYS.find(x => x.id === d)?.label).join(", ")} a las {nextTrip.departureTime} - {nextTrip.role === "DRIVER" ? "Conductor" : "Pasajero"}
                  </div>
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    {nextTrip.origin} <span className="text-gray-500">→</span> {nextTrip.destination}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {nextTrip.role === "DRIVER" ? `${nextTrip.seats} cupos disponibles` : `Buscando ${nextTrip.seats} cupos`}
                  </div>
                </div>
                <Link href="/dashboard/routines">
                  <Button variant="primary" className="cursor-pointer">Ver Detalles</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="bg-white/5 border-white/10 flex flex-col items-center justify-center py-8">
              <p className="text-gray-400 mb-4">No tienes ninguna rutina configurada.</p>
              <Link href="/dashboard/routines">
                <Button variant="outline" className="cursor-pointer">Añadir Rutina</Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Billetera Resumen */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="text-brand-light" />
            Saldo Disponible
          </h2>
          <Card className="flex flex-col justify-center items-center py-8">
            <span className="text-4xl font-extrabold text-white text-glow mb-2">
              ${wallet?.balance.toFixed(2) || "0.00"}
            </span>
            <span className="text-sm text-gray-400 mb-6">En tu billetera virtual</span>
            <Link href="/dashboard/wallet" className="w-full">
              <Button variant="outline" className="w-full cursor-pointer">Ver Billetera</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Buscar Viaje Rapido */}
      <div className="pt-8">
        <h2 className="text-xl font-bold text-white mb-4">¿Necesitas un viaje de última hora?</h2>
        <Card className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <MapPin className="text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="¿Hacia dónde vas?" 
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500"
            />
          </div>
          <Link href="/dashboard/explore" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full cursor-pointer px-8">
              <Search className="w-5 h-5 mr-2" />
              Explorar Rutas
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
