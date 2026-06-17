import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/20 to-neon-cyan/20 flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-brand-light animate-spin" />
        </div>
      </div>
      <p className="text-gray-400 font-medium animate-pulse">Cargando sección...</p>
    </div>
  );
}
