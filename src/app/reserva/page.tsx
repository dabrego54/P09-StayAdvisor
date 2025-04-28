'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner'; 
import BookingForm, { BookingData } from '@/components/BookingForm';
import hotelsJson from '@/data/hotels.json';
import type { Hotel } from '@/types/Hotel';

export default function ReservaPage() {
  const [formData, setFormData] = useState<BookingData | null>(null);
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const hotelSeleccionado: Hotel | null = hotelsJson.find(h => h.id === Number(hotelId)) ?? null;

  const router = useRouter();

  const handleReserva = () => {
    if (!hotelSeleccionado || !formData) {
      toast.error('Por favor completa todos los datos antes de confirmar.');
      return;
    }

    try {
      localStorage.setItem('hotelSeleccionado', JSON.stringify(hotelSeleccionado));
      localStorage.setItem('reservaConfirmada', JSON.stringify(formData));
      toast.success('Reserva confirmada exitosamente.');
      setTimeout(() => {
        router.push('/confirmacion');
      }, 500);
    } catch (error) {
      console.error('Error al guardar reserva:', error);
      toast.error('Ocurrió un error al confirmar la reserva.');
    }
  };

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
            onClick={handleReserva}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-transform transition-shadow duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}
