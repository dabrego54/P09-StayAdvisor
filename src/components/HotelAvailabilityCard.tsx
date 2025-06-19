'use client';

import { useHotelAvailability } from '@/hooks/useHotelAvailability';
import Calendar from './Calendar';

type Props = {
  hotelName: string;
  hotelPlaceId: string;
};

export default function HotelAvailabilityCard({ hotelName, hotelPlaceId }: Props) {
  const { bookedDates, loading } = useHotelAvailability(hotelPlaceId);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Calendario de Disponibilidad - {hotelName}
      </h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Cargando calendario...</p>
      ) : (
        <Calendar bookedDates={bookedDates} />
      )}
    </div>
  );
}
