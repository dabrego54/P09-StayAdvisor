'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BookingForm, { BookingData } from '@/components/BookingForm';
import type { HotelReal } from '@/types/HotelReal';
import { useAuth } from '@/context/AuthContext';

export default function ReservaPage() {
  const [formData, setFormData] = useState<BookingData | null>(null);
  const [hotelSeleccionado, setHotelSeleccionado] = useState<HotelReal | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    try {
      const storedHotel = localStorage.getItem('hotelSeleccionado');
      if (storedHotel) {
        setHotelSeleccionado(JSON.parse(storedHotel));
      }
    } catch (error) {
      console.error('Error al recuperar hotel:', error);
    }
  }, []);

  const handleReserva = async () => {
    if (!hotelSeleccionado || !formData) {
      toast.error('Por favor completa todos los datos antes de confirmar.');
      return;
    }

    // Validar disponibilidad
    try {
      const checkResponse = await fetch('/api/reservas/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelPlaceId: hotelSeleccionado.placeId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        })
      });

      const checkData = await checkResponse.json();
      if (!checkData.disponible) {
        toast.error('El hotel ya está reservado en esas fechas.');
        return;
      }
    } catch (err) {
      console.error('Error al verificar disponibilidad:', err);
      toast.error('No se pudo verificar disponibilidad. Intenta de nuevo.');
      return;
    }

    // Proceder a guardar
    const reservaPayload = {
      hotelName: hotelSeleccionado.name,
      hotelPlaceId: hotelSeleccionado.placeId,
      userEmail: user?.email || formData.email,
      userId: user?.id,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      contactName: formData.fullName,
      contactPhone: formData.phone,
      contactEmail: formData.email,
      notes: formData.notes ?? '',
    };

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaPayload),
      });

      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Fechas no disponibles.');
        return;
      }

      if (!response.ok) throw new Error('Fallo al guardar reserva');

      localStorage.setItem('reservaConfirmada', JSON.stringify(formData));
      toast.success('Reserva confirmada exitosamente.');
      setTimeout(() => router.push('/confirmacion'), 500);
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
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
          <p className="text-base sm:text-lg">{hotelSeleccionado.name}</p>
          <p className="text-sm text-gray-500 italic">{hotelSeleccionado.address}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full">
        <BookingForm onChange={setFormData} />
      </div>

      {hotelSeleccionado && formData && (
        <div className="max-w-2xl mx-auto w-full mt-8 flex justify-center">
          <button
            onClick={handleReserva}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  );
}

