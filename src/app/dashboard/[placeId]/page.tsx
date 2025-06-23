'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/header';
import HotelAvailabilityCard from '@/components/HotelAvailabilityCard';
import DisponibilidadForm from '@/components/DisponibilidadForm';
import ReservasActivasList from '@/components/ReservasActivasList';

export default function HotelCalendarPage() {
  const { placeId } = useParams();
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const handleUpdate = () => {
    setRefreshToken(Date.now()); // fuerza nueva llamada
  };

  useEffect(() => {
    const fetchMessage = async () => {
      const res = await fetch(`/api/hotel-details?placeId=${placeId}`);
      const data = await res.json();
      if (data.success && data.hotel?.welcomeMessage) {
        setWelcomeMessage(data.hotel.welcomeMessage);
      }
      setLoading(false);
    };
    if (placeId) fetchMessage();
  }, [placeId]);

  const handleSave = async () => {
    const res = await fetch('/api/admin/mensaje-bienvenida', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId, welcomeMessage }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Mensaje guardado exitosamente');
    } else {
      toast.error('Error al guardar mensaje');
    }
  };

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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 p-6">
        <HotelAvailabilityCard placeId={placeId} refreshKey={refreshToken} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 max-w-7xl mx-auto">
          <DisponibilidadForm placeId={placeId} onUpdate={handleUpdate} />
          <ReservasActivasList placeId={placeId} />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Mensaje de Bienvenida</h2>
          {loading ? (
            <p className="text-gray-600">Cargando mensaje...</p>
          ) : (
            <>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Escribe aquí el mensaje que verán tus clientes tras reservar..."
                className="w-full h-40 p-4 border rounded resize-none"
              />
              <button
                onClick={handleSave}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar mensaje
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
