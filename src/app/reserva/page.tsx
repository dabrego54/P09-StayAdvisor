'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingForm, { BookingData } from '@/components/BookingForm';
import hotelsJson from '@/data/hotels.json';
import { useSearchParams } from 'next/navigation';
import type { Hotel } from '@/types/Hotel';

export default function ReservaPage() {
  const [formData, setFormData] = useState<BookingData | null>(null);
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const hotelSeleccionado: Hotel | null = hotelsJson.find(h => h.id === Number(hotelId)) ?? null;

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
        🏨 Reserva tu Hotel Boutique
      </h1>

      {hotelSeleccionado && (
        <div className="mb-6 text-center text-gray-700 px-2">
          <h2 className="text-lg sm:text-xl font-semibold">Hotel seleccionado:</h2>
          <p className="text-base sm:text-lg">{hotelSeleccionado.name} – {hotelSeleccionado.location}</p>
          <p className="text-sm text-gray-500 italic">{hotelSeleccionado.experience}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full">
        <BookingForm onChange={setFormData} />
      </div>

      {hotelSeleccionado && formData && (
        <div className="max-w-2xl mx-auto w-full mt-8 flex justify-center">
          <button
            onClick={() => {
              localStorage.setItem('hotelSeleccionado', JSON.stringify(hotelSeleccionado));
              localStorage.setItem('reservaConfirmada', JSON.stringify(formData));
              router.push('/confirmacion');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-transform transition-shadow duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}
