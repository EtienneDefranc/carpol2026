"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@espol.edu.ec")) {
      alert("Por favor, ingresa tu correo institucional de ESPOL (@espol.edu.ec).");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await signIn("email", { email, redirect: false, callbackUrl: "/dashboard" });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al enviar el correo. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {isSuccess ? (
          <div className="flex flex-col items-center text-center space-y-4 animate-fade-in py-4">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
            <h2 className="text-xl font-bold text-white">¡Revisa tu bandeja de entrada!</h2>
            <p className="text-gray-400 text-sm">
              Te hemos enviado un enlace mágico a <strong>{email}</strong>. 
              Haz clic en el enlace para entrar de forma segura sin contraseña.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@espol.edu.ec" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand/50 transition-colors"
                required
              />
            </div>
            
            <Button 
              type="submit"
              variant="primary" 
              className="w-full text-base py-4 flex items-center justify-center gap-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando enlace..." : "Recibir enlace de acceso"}
            </Button>

            <div className="mt-6 text-xs text-gray-500 text-center">
              Asegúrate de revisar tu carpeta de Spam si no lo encuentras en unos segundos.
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
