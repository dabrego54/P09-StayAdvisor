// /components/HotelAvailabilityCard.tsx

'use client';

import CalendarSimple from './CalendarSimple';
import { useHotelAvailability } from '@/hooks/useHotelAvailability';

interface Props {
  placeId: string;
  refreshKey?: string | number; // <- aceptar ambos
}

export default function HotelAvailabilityCard({ placeId, refreshKey }: Props) {
  const { fechasOcupadas, loading } = useHotelAvailability(placeId);
  const fechasOrdenadas = Object.entries(fechasOcupadas).sort(([a], [b]) => a.localeCompare(b));

  if (loading) {
    return (
      <div className="w-full text-center text-gray-500 py-10">
        Cargando disponibilidad...
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Calendario de Disponibilidad
          </h2>
          <div className="border rounded-xl bg-gray-50 p-4">
            <CalendarSimple fechasOcupadas={fechasOcupadas} />
          </div>
        </div>

        {/* Tabla de reservas */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reservas Activas
          </h2>
          <div className="overflow-y-auto border rounded-xl max-h-[420px] bg-white">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Contacto</th>
                </tr>
              </thead>
              <tbody>
                {fechasOrdenadas.length > 0 ? (
                  fechasOrdenadas.map(([fecha, contacto]) => (
                    <tr key={fecha} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-2 font-medium">
                        {new Date(fecha).toLocaleDateString('es-CL', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{contacto}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                      No hay reservas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
