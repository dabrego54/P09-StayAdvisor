'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CalendarSimple from '@/components/CalendarSimple';
import Header from '@/components/header';

export default function HotelCalendarPage() {
  const { placeId } = useParams();
  const [fechasOcupadas, setFechasOcupadas] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFechas = async () => {
      if (!placeId || typeof placeId !== 'string') return;
      const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
      const data = await res.json();
      setFechasOcupadas(data.fechasOcupadas || {});
    };

    fetchFechas();
  }, [placeId]);

  if (!placeId || typeof placeId !== 'string') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <p className="text-red-600 text-lg">ID de hotel inválido</p>
        </main>
      </>
    );
  }

  const fechasOrdenadas = Object.entries(fechasOcupadas).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Gestión de Reservas del Hotel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Calendario */}
          <CalendarSimple fechasOcupadas={fechasOcupadas} />

          {/* Tabla de reservas */}
          <div className="bg-white rounded-xl shadow border p-4 max-h-[500px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Reservas activas</h2>
            <ul className="divide-y divide-gray-200">
              {fechasOrdenadas.length === 0 ? (
                <li className="text-sm text-gray-500">No hay reservas registradas.</li>
              ) : (
                fechasOrdenadas.map(([fecha, contacto]) => (
                  <li key={fecha} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{new Date(fecha).toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">Reservado por {contacto}</p>
                    </div>
                    <div className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-md font-semibold">Ocupado</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
