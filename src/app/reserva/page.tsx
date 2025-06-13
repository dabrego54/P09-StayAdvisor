'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingForm, { BookingData } from '@/components/BookingForm';
import BookingSummary from '@/components/BookingSummary';
import type { HotelReal } from '@/types/HotelReal';
import { toast } from 'sonner';

export default function ReservaPage() {
  const [hotel, setHotel] = useState<HotelReal | null>(null);
  const [reservaData, setReservaData] = useState<BookingData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('hotelSeleccionado');
    if (data) {
      setHotel(JSON.parse(data));
    } else {
      toast.error('No se encontró información del hotel.');
      router.push('/');
    }
  }, []);

  const handleConfirmarReserva = async () => {
    if (!hotel || !reservaData) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel,
          ...reservaData,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Error al guardar la reserva.');
        setSubmitting(false);
        return;
      }

      // Guardar en localStorage para la pantalla de confirmación
      localStorage.setItem('hotelSeleccionado', JSON.stringify(hotel));
      localStorage.setItem('reservaConfirmada', JSON.stringify(reservaData));

      toast.success('✅ Reserva confirmada');
      router.push('/confirmacion');
    } catch (err) {
      console.error('Error al enviar reserva:', err);
      toast.error('No se pudo conectar con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {hotel && (
          <>
            <BookingForm onChange={setReservaData} />
            <BookingSummary hotel={hotel} data={reservaData} />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleConfirmarReserva}
                disabled={!reservaData || submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
