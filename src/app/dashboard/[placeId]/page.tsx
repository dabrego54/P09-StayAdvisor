'use client';

import { useParams } from 'next/navigation';
import HotelAvailabilityCard from '@/components/HotelAvailabilityCard';

export default function HotelCalendarPage() {
  const { placeId } = useParams();

  if (!placeId || typeof placeId !== 'string') {
    return <p className="text-white text-center mt-10">ID de hotel inválido</p>;
  }

  return (
    <main className="min-h-screen px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Calendario de Disponibilidad
        </h1>
        <HotelAvailabilityCard placeId={placeId} />
      </div>
    </main>
  );
}
