'use client';

import type { BookingData } from './BookingForm';
import type { HotelReal } from '@/types/HotelReal';

interface BookingSummaryProps {
  hotel: HotelReal | null;
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
  const estimatedPrice = nights * hotel.rating * 10000; // estimación basada en rating

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-8 mt-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Resumen de Reserva
      </h2>

      <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
        <li><strong>Hotel:</strong> {hotel.name} ({hotel.address})</li>
        <li><strong>Ubicación:</strong> lat {hotel.location.lat}, lng {hotel.location.lng}</li>
        <li><strong>Fechas:</strong> {data.checkIn} → {data.checkOut} ({nights} noches)</li>
        <li><strong>Huéspedes:</strong> {data.guests}</li>
        <li><strong>Rating global:</strong> {hotel.rating} ⭐ ({hotel.totalRatings} reseñas)</li>
        <li><strong>Servicios estimados:</strong> WiFi, Desayuno</li>
        <li className="text-lg font-semibold text-green-700">
          Precio estimado: ${estimatedPrice}
        </li>
      </ul>
    </div>
  );
}
