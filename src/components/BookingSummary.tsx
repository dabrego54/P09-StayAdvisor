'use client';

import type { BookingData } from './BookingForm';
import type { HotelReal } from '@/types/HotelReal';

interface BookingSummaryProps {
  hotel: HotelReal | null;
  data: BookingData | null;
  apiKey: string;
}

export default function BookingSummary({ hotel, data, apiKey }: BookingSummaryProps) {
  if (!hotel || !data) return null;

  const getNightCount = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = getNightCount(data.checkIn, data.checkOut);
  const estimatedPrice = nights * 100; // 💡 puedes ajustar este valor si luego traes `price` real

  const photoUrl = hotel.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photoReference}&key=${apiKey}`
    : '/default-hotel.jpg';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-8 mt-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Resumen de Reserva
      </h2>

      <div className="relative w-full h-48 sm:h-60 rounded-md overflow-hidden mb-6">
        <img src={photoUrl} alt={hotel.name} className="w-full h-full object-cover" />
      </div>

      <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
        <li><strong>Hotel:</strong> {hotel.name}</li>
        <li><strong>Dirección:</strong> {hotel.address}</li>
        <li><strong>Fechas:</strong> {data.checkIn} → {data.checkOut} ({nights} noches)</li>
        <li><strong>Huéspedes:</strong> {data.guests}</li>
        <li><strong>Email:</strong> {data.email}</li>
        {data.phone && <li><strong>Teléfono:</strong> {data.phone}</li>}
        {data.notes && <li><strong>Comentarios:</strong> {data.notes}</li>}
        <li><strong>Servicios incluidos:</strong> Desayuno, Wifi, Toallas</li>
        <li className="text-lg font-semibold text-green-700">
          Total estimado: ${estimatedPrice}
        </li>
      </ul>
    </div>
  );
}
