//LANDING PAGE

import Link from "next/link";

const mockHotels = [
  {
    id: 1,
    name: "Hotel Magnolia",
    location: "Santiago",
    experience: "Lujo clásico",
  },
  {
    id: 2,
    name: "Casa Andina Premium",
    location: "Cusco",
    experience: "Auténtico andino",
  },
  {
    id: 3,
    name: "Palacio Astoreca",
    location: "Valparaíso",
    experience: "Boutique frente al mar",
  },
];

export default function SearchPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔍 Buscar Hoteles Boutique
        </h1>
        <form>
          <input
            type="text"
            placeholder="Ej: Casa Andina, Hotel Magnolia..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        {/* 🔽 Resultados simulados */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Resultados simulados
          </h2>
          {mockHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-blue-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600">
                {hotel.location} — {hotel.experience}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">StayAdvisor</h1>
        <p className="text-gray-700 text-lg mb-8">
          Encuentra tu <span className="font-semibold text-blue-600">hotel boutique ideal</span> con experiencias únicas.
        </p>
        <Link href="/search">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
            🔍 Ir al buscador
          </button>
        </Link>
      </div>
    </main>
  );
}
