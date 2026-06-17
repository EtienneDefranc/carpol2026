import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, CalendarClock, CreditCard, ShieldAlert } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Carpol futuristic background" 
          fill 
          className="object-cover opacity-30 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/80 to-[#09090b]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 container mx-auto px-6 pt-32 pb-16 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sm text-brand-light mb-8 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-slow"></span>
          Exclusivo para la comunidad ESPOL
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-glow">
          Tu rutina, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-brand-light">tu viaje.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          La plataforma definitiva de carpooling diseñada para la vida universitaria.
          Sin mensajes perdidos, sin fricción. Solo emparejamiento automático por rutinas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button variant="primary" className="text-lg font-semibold">
            Empezar Ahora
          </Button>
          <Button variant="secondary" className="text-lg font-semibold">
            Saber Más
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 w-full bg-black/40 backdrop-blur-sm border-t border-white/5 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CalendarClock className="w-10 h-10 text-brand-light mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Match Automático</h3>
              <p className="text-gray-400 text-sm">Emparejamiento inteligente basado en tu horario semestral y rutas habituales.</p>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <ShieldCheck className="w-10 h-10 text-neon-cyan mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Check-in por QR</h3>
              <p className="text-gray-400 text-sm">Validación instantánea y segura al abordar mediante escaneo de código QR.</p>
            </Card>
            
            <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CreditCard className="w-10 h-10 text-neon-pink mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Pagos Automatizados</h3>
              <p className="text-gray-400 text-sm">Billetera virtual integrada con Payphone. El pago se libera al escanear el QR.</p>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <ShieldAlert className="w-10 h-10 text-brand mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Red de Contingencia</h3>
              <p className="text-gray-400 text-sm">Reasignación instantánea de pasajeros si un conductor cancela a última hora.</p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
