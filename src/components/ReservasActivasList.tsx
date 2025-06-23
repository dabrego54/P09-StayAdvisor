'use client';

import { useEffect, useState } from 'react';
import ReservaEditorCard from './ReservaEditorCard';

interface Reserva {
  _id: string;
  contactName: string;
  checkIn: string;
  checkOut: string;
  preferencias?: string; // ✅ nuevo campo opcional
}

interface Props {
  placeId: string;
}

export default function ReservasActivasList({ placeId }: Props) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservas = async () => {
    try {
      const res = await fetch(`/api/reservas?placeId=${placeId}`);
      const data = await res.json();
      if (data.success) {
        setReservas(data.reservas);
      } else {
        console.error('Error en la respuesta:', data.message);
      }
    } catch (err) {
      console.error('Error al cargar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [placeId]);

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Modificar reservas activas</h3>

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="text-sm text-gray-500">No hay reservas activas.</p>
      ) : (
        <div className="space-y-4">
  {reservas.map((reserva) => (
    <ReservaEditorCard
      key={reserva._id}
      reservaId={reserva._id}
      nombre={reserva.contactName}
      checkIn={reserva.checkIn}
      checkOut={reserva.checkOut}
      preferencias={reserva.preferencias} // ✅ pasar el campo aquí
      placeId={placeId}
      onSuccess={fetchReservas}
    />
  ))}
</div>

      )}
    </div>
  );
}
