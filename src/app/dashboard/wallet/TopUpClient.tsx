"use client";

import { useState } from "react";
import { simulateTopUp } from "@/app/actions/wallet";
import { Button } from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";

export function TopUpClient() {
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  const handleTopUp = async () => {
    setIsTopUpLoading(true);
    try {
      await simulateTopUp(5.00); // Simulamos una recarga fija de $5
      alert("¡Recarga de $5.00 exitosa (Simulación Payphone)!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleTopUp} 
      disabled={isTopUpLoading}
      className="flex items-center gap-2 px-8"
    >
      <PlusCircle className="w-5 h-5" />
      {isTopUpLoading ? "Procesando..." : "Recargar $5.00 (Payphone)"}
    </Button>
  );
}
