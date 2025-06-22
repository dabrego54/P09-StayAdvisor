import CalendarSimple from './CalendarSimple';
import { useHotelAvailability } from '@/hooks/useHotelAvailability';

export default function HotelAvailabilityCard({ placeId }: { placeId: string }) {
  const { fechasOcupadas, loading } = useHotelAvailability(placeId);
  const fechasOrdenadas = Object.entries(fechasOcupadas).sort(([a], [b]) => a.localeCompare(b));

  if (loading) return <p className="text-center text-gray-600">Cargando disponibilidad...</p>;

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto h-full">
        {/* Calendario */}
        <div className="w-full h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Calendario de Disponibilidad</h2>
          <div className="flex-1 border rounded-xl p-4 shadow-sm bg-gray-50 flex items-center justify-center">
            <CalendarSimple fechasOcupadas={fechasOcupadas} />
          </div>
        </div>

        {/* Tabla de reservas */}
        <div className="w-full h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Reservas Activas</h2>
          <div className="flex-1 overflow-x-auto border rounded-xl shadow-sm bg-gray-50">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Contacto</th>
                </tr>
              </thead>
              <tbody>
                {fechasOrdenadas.map(([fecha, contacto]) => (
                  <tr key={fecha} className="border-t hover:bg-gray-100 transition">
                    <td className="px-4 py-2 font-medium">{fecha}</td>
                    <td className="px-4 py-2">{contacto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
