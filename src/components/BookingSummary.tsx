'use client';

import type { BookingData } from './BookingForm';
import type { Hotel } from '@/types/Hotel';

interface BookingSummaryProps {
  hotel: Hotel | null;
  data: BookingData | null;
}

export default function BookingSummary({ hotel, data }: BookingSummaryProps) {
  if (!hotel || !data) return null;

  const getNightCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = getNightCount(data.checkIn, data.checkOut);
  const estimatedPrice = nights * hotel.price;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Resumen de Reserva</h2>

      <ul className="space-y-2 text-gray-700 text-base">
        <li><strong>Hotel:</strong> {hotel.name} ({hotel.location})</li>
        <li><strong>Experiencia:</strong> {hotel.experience}</li>
        <li><strong>Fechas:</strong> {data.checkIn} → {data.checkOut} ({nights} noches)</li>
        <li><strong>Huéspedes:</strong> {data.guests}</li>
        <li><strong>Servicios incluidos:</strong> {hotel.services.join(', ')}</li>
        <li><strong>Precio estimado:</strong> ${estimatedPrice}</li>
      </ul>
    </div>
  );
}
