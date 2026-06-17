import { getWallet } from "@/app/actions/wallet";
import { Card } from "@/components/ui/Card";
import { TopUpClient } from "./TopUpClient";
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon } from "lucide-react";

export default async function WalletPage() {
  const wallet = await getWallet();

  if (!wallet) {
    return <div className="text-white">Error cargando billetera.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Billetera Carpol</h1>
        <p className="text-gray-400">
          Gestiona tu saldo virtual para pagar o recibir pagos de viajes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tarjeta Visual de Billetera */}
        <div className="lg:col-span-5">
          <Card className="p-8 relative overflow-hidden bg-gradient-to-br from-brand/80 to-neon-cyan/80 border-0 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <WalletIcon className="w-32 h-32 text-white" />
            </div>
            
            <p className="text-white/80 font-medium tracking-widest text-sm mb-2 uppercase">Saldo Disponible</p>
            <h2 className="text-5xl font-extrabold text-white mb-8 tracking-tight">
              ${wallet.balance.toFixed(2)}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <TopUpClient />
            </div>
          </Card>
        </div>

        {/* Historial de Transacciones */}
        <div className="lg:col-span-7">
          <h2 className="text-xl font-bold text-white mb-4">Movimientos Recientes</h2>
          <Card className="p-0 overflow-hidden border-white/10">
            {wallet.transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tienes movimientos en tu billetera.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "DEPOSIT" || tx.type === "PAYMENT_RELEASED" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {tx.type === "DEPOSIT" || tx.type === "PAYMENT_RELEASED" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {tx.type === "DEPOSIT" ? "Recarga Payphone" : 
                           tx.type === "PAYMENT_RELEASED" ? "Cobro de viaje" : 
                           tx.type === "PAYMENT_ESCROW" ? "Pago de viaje retenido" : tx.type}
                        </p>
                        <p className="text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === "DEPOSIT" || tx.type === "PAYMENT_RELEASED" ? "text-green-400" : "text-white"}`}>
                      {tx.type === "DEPOSIT" || tx.type === "PAYMENT_RELEASED" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
