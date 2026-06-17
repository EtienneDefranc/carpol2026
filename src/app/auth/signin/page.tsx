"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px]"></div>
      </div>

      <Card className="relative z-10 w-full max-w-md p-8 border border-white/10 flex flex-col items-center animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-neon-cyan mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <span className="text-2xl font-bold text-white">C</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-white mb-2">Bienvenido a Carpol</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Inicia sesión usando tu correo institucional de ESPOL.
        </p>

        <Button 
          variant="primary" 
          className="w-full text-base py-4 flex items-center justify-center gap-3"
          onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
        >
          {/* Microsoft Icon */}
          <svg viewBox="0 0 21 21" className="w-5 h-5 bg-white p-0.5 rounded-sm">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Ingresar con Outlook
        </Button>

        <div className="mt-6 text-xs text-gray-500 text-center">
          Al iniciar sesión, aceptas usar únicamente correos con el dominio @espol.edu.ec
        </div>
      </Card>
    </div>
  );
}
