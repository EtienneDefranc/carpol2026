import { SearchClient } from "./SearchClient";

export default function ExplorePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Bolsa de Viajes</h1>
        <p className="text-gray-400">
          Encuentra conductores con rutinas que coincidan con tus horarios y ubicaciones.
        </p>
      </div>

      <SearchClient />
    </div>
  );
}
