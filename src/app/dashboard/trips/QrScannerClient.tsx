"use client";

import { useState } from "react";
import { confirmPassengerQr } from "@/app/actions/trips";
import { Button } from "@/components/ui/Button";

export function QrScannerClient({ bookingId }: { bookingId: string }) {
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!qrCode) return;
    setIsLoading(true);
    try {
      await confirmPassengerQr(bookingId, qrCode);
      alert("¡Código validado! El pago ha sido transferido a tu billetera.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
      setQrCode("");
    }
  };

  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        placeholder="Token QR del pasajero" 
        value={qrCode}
        onChange={(e) => setQrCode(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-brand/50 outline-none"
      />
      <Button variant="primary" onClick={handleScan} disabled={isLoading} className="py-2 px-4 text-sm">
        {isLoading ? "Validando..." : "Validar"}
      </Button>
    </div>
  );
}
