'use client';

import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Reserva {
  _id: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  contactName: string;
}

export default function MisReservasPage() {
  const { user } = useAuth();
  const [reservasActivas, setReservasActivas] = useState<Reserva[]>([]);
  const [reservasPasadas, setReservasPasadas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchReservas = async () => {
      try {
        const res = await fetch(`/api/reservas/user?userId=${user.id}`);
        const data: Reserva[] = await res.json();

        const hoy = new Date();
        const activas = data.filter(r => new Date(r.checkOut) >= hoy);
        const pasadas = data.filter(r => new Date(r.checkOut) < hoy);

        setReservasActivas(activas);
        setReservasPasadas(pasadas);
      } catch (error) {
        console.error('Error al obtener reservas del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-[#0f172a]">Mis reservas</h1>

        {loading ? (
          <p className="text-gray-600">Cargando reservas...</p>
        ) : (
          <>
            {reservasActivas.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Reservas activas</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {reservasActivas.map((reserva) => (
                    <div key={reserva._id} className="border rounded-lg p-4 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{reserva.hotelName}</h3>
                      <p className="text-sm text-gray-600">{reserva.contactName}</p>
                      <p className="text-sm text-gray-500">
                        🗓️ {new Date(reserva.checkIn).toLocaleDateString()} — {new Date(reserva.checkOut).toLocaleDateString()}
                      </p>
                      <span className="inline-block mt-2 text-sm text-green-600 font-medium">Activa</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {reservasPasadas.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Historial de reservas</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {reservasPasadas.map((reserva) => (
                    <div key={reserva._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{reserva.hotelName}</h3>
                      <p className="text-sm text-gray-600">{reserva.contactName}</p>
                      <p className="text-sm text-gray-500">
                        🗓️ {new Date(reserva.checkIn).toLocaleDateString()} — {new Date(reserva.checkOut).toLocaleDateString()}
                      </p>
                      <span className="inline-block mt-2 text-sm text-gray-400 font-medium">Finalizada</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {reservasActivas.length === 0 && reservasPasadas.length === 0 && (
              <p className="text-gray-500">Aún no tienes reservas registradas.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
