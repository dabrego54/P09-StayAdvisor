// src/app/reserva/page.tsx

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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        🏨 Reserva tu Hotel Boutique
      </h1>

      {hotelSeleccionado && (
        <div className="mb-6 text-center text-gray-700">
          <h2 className="text-xl font-semibold">Hotel seleccionado:</h2>
          <p>{hotelSeleccionado.name} – {hotelSeleccionado.location}</p>
          <p className="text-sm text-gray-500 italic">{hotelSeleccionado.experience}</p>
        </div>
      )}

      <BookingForm onChange={setFormData} />

      {hotelSeleccionado && formData && (
        <div className="max-w-xl mx-auto mt-6 flex justify-center">
          <button
            onClick={() => {
              localStorage.setItem('hotelSeleccionado', JSON.stringify(hotelSeleccionado));
              localStorage.setItem('reservaConfirmada', JSON.stringify(formData));
              router.push('/confirmacion');
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}