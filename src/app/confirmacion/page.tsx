'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner'; 
import type { BookingData } from '@/components/BookingForm';
import type { HotelReal } from '@/types/HotelReal';
import RatingForm from '@/components/RatingForm';

export default function ConfirmacionPage() {
  const [hotel, setHotel] = useState<HotelReal | null>(null);
  const [reserva, setReserva] = useState<BookingData | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);

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

  if (!hotel || !reserva) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-2">No hay datos de reserva</h2>
        <p className="text-gray-500 mb-4">Por favor, realiza una reserva antes de acceder a esta página.</p>
        <a href="/reserva" className="text-blue-600 underline hover:text-blue-800 text-sm sm:text-base">Volver a reservar</a>
      </div>
    );
  }

  const getNightCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = getNightCount(reserva.checkIn, reserva.checkOut);
  const total = nights * hotel.rating * 10000; // Precio estimado si no tienes precio real

  return (
    <div className="min-h-screen bg-white py-8 sm:py-10 px-4 sm:px-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-2">✅ Reserva Confirmada</h1>
      {reservationId && (
        <p className="text-sm text-center text-gray-500 mb-6">Código de reserva: #{reservationId}</p>
      )}

      <div className="bg-gray-100 p-6 sm:p-8 rounded-xl shadow space-y-4 text-gray-800 text-sm sm:text-base">
        <p><strong>Hotel:</strong> {hotel.name} ({hotel.address})</p>
        <p><strong>Rating global:</strong> {hotel.rating} ⭐ ({hotel.totalRatings} reseñas)</p>
        <p><strong>Fechas:</strong> {reserva.checkIn} a {reserva.checkOut} ({nights} noches)</p>
        <p><strong>Huéspedes:</strong> {reserva.guests}</p>
        <p><strong>Nombre:</strong> {reserva.fullName}</p>
        <p><strong>Email:</strong> {reserva.email}</p>
        {reserva.phone && <p><strong>Teléfono:</strong> {reserva.phone}</p>}
        {reserva.notes && <p><strong>Comentarios:</strong> {reserva.notes}</p>}
        <p className="text-lg font-semibold">Total estimado: ${total}</p>
      </div>

      {hotel.placeId && (
        <div className="mt-8">
          <RatingForm hotelPlaceId={hotel.placeId} />
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
    </div>
  );
}
