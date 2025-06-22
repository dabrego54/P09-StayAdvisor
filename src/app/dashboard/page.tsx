'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

interface Hotel {
  hotelName: string;
  hotelPlaceId: string;
}

export default function DashboardPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        const res = await fetch('/api/admin/hoteles-con-reservas');
        const data = await res.json();
        if (data.success) setHoteles(data.hoteles);
      } catch (error) {
        console.error('Error al cargar hoteles con reservas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, []);

  const filtered = hoteles.filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-gray-900 px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Hoteles con Reservas Activas
        </h1>

        <div className="max-w-2xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Buscar hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg shadow-sm border border-gray-300 text-gray-800"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Cargando hoteles...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron hoteles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
            {filtered.map((hotel) => (
              <div
                key={hotel.hotelPlaceId}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/dashboard/${hotel.hotelPlaceId}`)}
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {hotel.hotelName}
                </h2>
                <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
                  Ver disponibilidad
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}