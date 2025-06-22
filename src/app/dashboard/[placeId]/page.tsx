'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/header';
import HotelAvailabilityCard from '@/components/HotelAvailabilityCard';
import DisponibilidadForm from '@/components/DisponibilidadForm';
import ReservasActivasList from '@/components/ReservasActivasList';

export default function HotelCalendarPage() {
  const { placeId } = useParams();
  const [refreshToken, setRefreshToken] = useState(Date.now());

  const handleUpdate = () => {
    setRefreshToken(Date.now()); // fuerza nueva llamada
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
      </main>
    </>
  );
}
