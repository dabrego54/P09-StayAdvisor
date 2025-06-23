'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { BookingData } from '@/components/BookingForm';
import type { HotelReal } from '@/types/HotelReal';
import BookingSummary from '@/components/BookingSummary';
import RatingForm from '@/components/RatingForm';
import { useAuth } from '@/context/AuthContext';

export default function ConfirmacionPage() {
  const { user } = useAuth();
  const [hotel, setHotel] = useState<HotelReal | null>(null);
  const [reserva, setReserva] = useState<BookingData | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [mensajeBienvenida, setMensajeBienvenida] = useState<string | null>(null);

  useEffect(() => {
    const hotelData = localStorage.getItem('hotelSeleccionado');
    const reservaData = localStorage.getItem('reservaConfirmada');

    if (hotelData) setHotel(JSON.parse(hotelData));
    if (reservaData) setReserva(JSON.parse(reservaData));
    setReservationId(Math.floor(Math.random() * 1000000));

    if (!hotelData || !reservaData) {
      toast.error('No se encontraron datos de la reserva.');
    }
  }, []);

  useEffect(() => {
    const fetchMensaje = async () => {
      if (!hotel?.placeId) return;

      const res = await fetch(`/api/hotel-details?placeId=${hotel.placeId}`);
      const data = await res.json();

      if (data.success && data.hotel?.welcomeMessage) {
        setMensajeBienvenida(data.hotel.welcomeMessage);
      }
    };

    if (hotel) fetchMensaje();
  }, [hotel]);

  if (!hotel || !reserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-2">No hay datos de reserva</h2>
        <p className="text-gray-500 mb-4">Por favor, realiza una reserva antes de acceder a esta página.</p>
        <a href="/reserva" className="text-blue-600 underline hover:text-blue-800 text-sm sm:text-base">
          Volver a reservar
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 sm:py-10 px-4 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-2">✅ Reserva Confirmada</h1>
      {reservationId && (
        <p className="text-sm text-center text-gray-500 mb-6">Código de reserva: #{reservationId}</p>
      )}

      {mensajeBienvenida && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="italic">{mensajeBienvenida}</p>
        </div>
      )}

      <BookingSummary
        hotel={hotel}
        data={reserva}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
      />

      {reserva?.preferencias && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Preferencias del huésped:</h3>
          <p className="text-gray-600 whitespace-pre-line">{reserva.preferencias}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <a
          href="/"
          className="text-blue-600 border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition-transform transition-shadow duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base text-center"
        >
          ← Volver al inicio
        </a>

        <button
          onClick={() => window.print()}
          className="border border-gray-400 px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-transform transition-shadow duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base text-center"
        >
          🖨 Imprimir resumen
        </button>
      </div>

      {user?.id && hotel?.placeId && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
            ¿Qué te pareció el hotel?
          </h2>
          <RatingForm hotelPlaceId={hotel.placeId} />
        </div>
      )}
    </div>
  );
}
