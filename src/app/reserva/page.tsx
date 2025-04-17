// src/app/reserva/page.tsx

'use client';

import { useState } from 'react';
import BookingForm, { BookingData } from '@/components/BookingForm';
import { useSearchParams } from 'next/navigation';
import hotelsJson from '@/data/hotels.json';



export default function ReservaPage() {
  const [formData, setFormData] = useState<BookingData | null>(null);
  const searchParams = useSearchParams();
    const hotelId = searchParams.get('hotelId');
    const hotelSeleccionado = hotelsJson.find(h => h.id === Number(hotelId));


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

      {formData && (
        <div className="mt-8 max-w-xl mx-auto bg-white border border-blue-100 rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Resumen de Reserva</h2>
          <p><span className="font-medium">Check-in:</span> {formData.checkIn}</p>
          <p><span className="font-medium">Check-out:</span> {formData.checkOut}</p>
          <p><span className="font-medium">Huéspedes:</span> {formData.guests}</p>
        </div>
      )}
    </div>
  );
}
