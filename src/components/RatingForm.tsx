'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface Props {
  hotelPlaceId: string;
}

export default function RatingForm({ hotelPlaceId }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [enviado, setEnviado] = useState(false);

  const [hasReservation, setHasReservation] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    const checkReservation = async () => {
      if (!user?.id || !hotelPlaceId) return;

      try {
        const res = await fetch('/api/reservas/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, hotelPlaceId }),
        });

        const data = await res.json();

        console.log('🟢 Verificando reserva para:', {
          userId: user.id,
          hotelPlaceId,
        });
        console.log('🟢 Respuesta de backend:', data);

        setHasReservation(data.hasReservation);
      } catch (error) {
        console.error('❌ Error al verificar reserva:', error);
      } finally {
        setLoadingCheck(false);
      }
    };

    checkReservation();
  }, [user, hotelPlaceId]);

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión para calificar.');
      return;
    }

    if (!rating) {
      toast.error('Selecciona una calificación.');
      return;
    }

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelPlaceId,
          userId: user.id,
          rating,
          comment,
        }),
      });

      if (response.status === 403) {
        toast.error('Solo puedes calificar si hiciste una reserva en este hotel.');
        return;
      }

      if (response.status === 409) {
        toast.warning('Ya calificaste este hotel.');
        setEnviado(true);
        return;
      }

      if (!response.ok) throw new Error();

      toast.success('Calificación enviada con éxito.');
      setEnviado(true);
    } catch {
      toast.error('Ocurrió un error al enviar tu calificación.');
    }
  };

  // 🔍 Logs de estado
  console.log('🧪 user:', user);
  console.log('🧪 loadingCheck:', loadingCheck);
  console.log('🧪 hasReservation:', hasReservation);

  if (!user || loadingCheck) return null;
  if (!hasReservation) {
    return (
      <p className="text-sm text-gray-500 mt-2">
        Solo puedes calificar si ya reservaste este hotel.
      </p>
    );
  }

  if (enviado) {
    return <p className="text-green-600 mt-4">✔️ ¡Gracias por tu calificación!</p>;
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tu calificación:</h4>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl transition ${
              (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentario (opcional)"
        rows={3}
        className="w-full p-3 sm:p-4 border rounded-lg text-base sm:text-[15px] text-gray-800 placeholder-gray-500 mb-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Enviar calificación
      </button>
    </div>
  );
}
