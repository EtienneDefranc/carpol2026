import { getMyTrips } from "@/app/actions/trips";
import { Card } from "@/components/ui/Card";
import { QRCodeSVG } from "qrcode.react";
import { QrScannerClient } from "./QrScannerClient";
import { MapPin, Clock, Calendar, CheckCircle2 } from "lucide-react";

export default async function TripsPage() {
  const data = await getMyTrips();

  if (!data) return <div className="text-white">Error al cargar viajes.</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Mis Viajes</h1>
        <p className="text-gray-400">
          Gestiona tus reservas como pasajero y tus viajes activos como conductor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna Pasajero */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Como Pasajero</h2>
          {data.passengerBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
              No tienes viajes programados.
            </div>
          ) : (
            <div className="space-y-4">
              {data.passengerBookings.map((b) => (
                <Card key={b.id} className="p-5 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${b.status === 'SCANNED' ? 'bg-green-500/20 text-green-400' : 'bg-brand/20 text-brand-light'}`}>
                        {b.status === 'SCANNED' ? 'Completado' : 'Pendiente'}
                      </span>
                      <span className="text-white font-bold">${b.ride.price.toFixed(2)}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Conductor</p>
                      <p className="text-white font-medium">{b.ride.driver.name}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" /> {new Date(b.ride.departureTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4" /> {new Date(b.ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-brand" /> {b.ride.origin} → {b.ride.destination}
                      </div>
                    </div>
                  </div>

                  {b.status !== 'SCANNED' ? (
                    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shrink-0">
                      <QRCodeSVG value={b.qrCode} size={100} />
                      <p className="text-[10px] text-gray-500 mt-2 text-center w-full break-all max-w-[100px]">Token: {b.qrCode}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl shrink-0 border border-green-500/30">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mb-2" />
                      <p className="text-xs text-green-400 font-bold">Pagado</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Columna Conductor */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Como Conductor</h2>
          {data.driverRides.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
              No tienes viajes creados hoy.
            </div>
          ) : (
            <div className="space-y-4">
              {data.driverRides.map((ride) => (
                <Card key={ride.id} className="p-5 border-l-4 border-l-neon-cyan">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" /> {new Date(ride.departureTime).toLocaleDateString()}
                    </div>
                    <span className="text-neon-cyan text-sm font-bold">{ride.bookings.length} Pasajeros</span>
                  </div>

                  <div className="space-y-4">
                    {ride.bookings.length === 0 ? (
                      <p className="text-sm text-gray-500">Nadie ha reservado este viaje aún.</p>
                    ) : (
                      ride.bookings.map(b => (
                        <div key={b.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-white font-medium">{b.passenger.name}</p>
                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${b.status === 'SCANNED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {b.status}
                            </span>
                          </div>
                          
                          {b.status !== 'SCANNED' && (
                            <QrScannerClient bookingId={b.id} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
