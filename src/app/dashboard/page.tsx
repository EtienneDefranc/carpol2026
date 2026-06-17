import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Search } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Bienvenido a tu Dashboard</h1>
        <p className="text-gray-400">Aquí tienes un resumen de tus próximas rutas y cupos disponibles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximo Viaje */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-neon-cyan" />
            Tu Próximo Viaje
          </h2>
          <Card className="bg-gradient-to-r from-brand/20 to-transparent border-brand/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="text-sm text-brand-light font-medium mb-1">Hoy, 14:30 - Conductor</div>
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  FCSH (ESPOL) <span className="text-gray-500">→</span> Urdesa Central
                </div>
                <div className="text-sm text-gray-400 mt-2">3 cupos disponibles</div>
              </div>
              <Button variant="primary">Ver Detalles</Button>
            </div>
          </Card>
        </div>

        {/* Billetera Resumen */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Saldo Disponible
          </h2>
          <Card className="flex flex-col justify-center items-center py-8">
            <span className="text-4xl font-extrabold text-white text-glow mb-2">$12.50</span>
            <span className="text-sm text-gray-400 mb-6">Equivalente a ~8 viajes</span>
            <Button variant="outline" className="w-full">Recargar (Payphone)</Button>
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
          <Button variant="primary" className="w-full sm:w-auto px-8">
            <Search className="w-5 h-5 mr-2" />
            Buscar Rutas
          </Button>
        </Card>
      </div>
    </div>
  );
}
