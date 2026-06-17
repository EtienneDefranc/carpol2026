import { getMyRoutines } from "@/app/actions/routines";
import { RoutineForm } from "./RoutineForm";
import { RoutineList } from "./RoutineList";

export default async function RoutinesPage() {
  const routines = await getMyRoutines();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Mis Rutinas</h1>
        <p className="text-gray-400">
          Registra tus horarios de clases. El sistema automáticamente generará los viajes correspondientes cada semana para realizar los &quot;Matches&quot;.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <RoutineForm />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Tus Rutinas Registradas</h2>
          <RoutineList routines={routines} />
        </div>
      </div>
    </div>
  );
}
