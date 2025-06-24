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
  const [comodidades, setComodidades] = useState('');
  const [comida, setComida] = useState('');
  const [servicio, setServicio] = useState('');
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
        setHasReservation(data.hasReservation);
      } catch (error) {
        console.error('Error al verificar reserva:', error);
        toast.error('Error al verificar reserva.', {
          description: 'Intenta recargar la página.',
        });
      } finally {
        setLoadingCheck(false);
      }
    };

    checkReservation();
  }, [user, hotelPlaceId]);

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión para calificar.', {
        description: 'Inicia sesión primero para dejar tu opinión.',
      });
      return;
    }

    if (!rating) {
      toast.error('Selecciona una calificación.', {
        description: 'Haz clic en una estrella para asignar tu nota.',
      });
      return;
    }

    try {
      const response = await fetch('/api/ratings/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelPlaceId,
          userId: user.id,
          rating,
          opiniones: {
            comodidades,
            comida,
            servicio,
          },
        }),
      });

      if (response.status === 403) {
        toast.error('Solo puedes calificar si hiciste una reserva.', {
          description: 'Haz una reserva antes de dejar tu calificación.',
        });
        return;
      }

      if (response.status === 409) {
        toast.warning('Ya calificaste este hotel.', {
          description: 'Solo puedes enviar una calificación por hotel.',
        });
        setEnviado(true);
        return;
      }

      if (!response.ok) throw new Error();

      toast.success('Calificación enviada con éxito.', {
        description: 'Gracias por tu opinión, ¡ayudará a otros viajeros!',
      });
      setEnviado(true);
    } catch {
      toast.error('Ocurrió un error al enviar tu calificación.', {
        description: 'Revisa tu conexión o inténtalo nuevamente.',
      });
    }
  };

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
            aria-label={`Estrella ${star}`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-3">
        <textarea
          value={comodidades}
          onChange={(e) => setComodidades(e.target.value)}
          placeholder="¿Qué te parecieron las comodidades de tu habitación?"
          rows={2}
          className="w-full p-3 border rounded-lg text-base placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <textarea
          value={comida}
          onChange={(e) => setComida(e.target.value)}
          placeholder="¿Qué te pareció el servicio de comidas ofrecido?"
          rows={2}
          className="w-full p-3 border rounded-lg text-base placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <textarea
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          placeholder="¿Qué te pareció el servicio al cliente prestado?"
          rows={2}
          className="w-full p-3 border rounded-lg text-base placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Enviar calificación
      </button>
    </div>
  );
}
