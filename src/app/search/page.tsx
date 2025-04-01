'use client'

import { useState } from 'react';

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
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Filtrar hoteles según el texto de búsqueda
  const filteredHotels = mockHotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchText.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchText.toLowerCase()) ||
    hotel.experience.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔍 Buscar Hoteles Boutique
        </h1>
        
        {/* Campo de búsqueda */}
        <form>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Ej: Casa Andina, Hotel Magnolia..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </form>

        {/* 🔽 Resultados filtrados */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Resultados simulados
          </h2>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-blue-800">{hotel.name}</h3>
                <p className="text-sm text-gray-600">
                  {hotel.location} — {hotel.experience}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No se encontraron resultados</p>
          )}
        </div>
      </div>
    </main>
  );
}

