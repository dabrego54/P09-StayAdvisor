'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Hotel = {
  hotelName: string;
  hotelPlaceId: string;
};

export default function DashboardPage() {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p className="text-center text-white">Cargando hoteles...</p>;

  return (
    <main className="min-h-screen px-4 py-10">
      <h1 className="text-2xl font-bold text-light mb-6 text-center">
        Hoteles con Reservas Activas
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
        {hoteles.map((hotel) => (
          <div
            key={hotel.hotelPlaceId}
            className="bg-card p-4 rounded-xl transition hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-light mb-2">{hotel.hotelName}</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
              onClick={() => router.push(`/dashboard/${hotel.hotelPlaceId}`)}
            >
              Ver Disponibilidad
            </button>
          </div>
        ))}
      </div>

    </main>
  );
}
