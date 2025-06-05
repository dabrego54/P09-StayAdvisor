"use client";

import { useEffect, useState } from "react";

interface RatingFormProps {
  hotelPlaceId: string;
}

export default function RatingForm({ hotelPlaceId }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    fetch(`/api/rating?placeId=${hotelPlaceId}`)
      .then(res => res.json())
      .then(data => {
        setAlreadyRated(data.alreadyRated);
      })
      .catch(() => {
        setMessage("No se pudo verificar el estado de tu calificación.");
      })
      .finally(() => {
        setLoadingStatus(false);
      });
  }, [hotelPlaceId]);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setMessage("⚠️ Selecciona una calificación válida (1–5 estrellas).");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelPlaceId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Error al enviar la calificación."}`);
      } else {
        setMessage("✅ ¡Gracias por tu calificación!");
        setAlreadyRated(true);
      }
    } catch (err) {
      setMessage("❌ Error inesperado. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStatus) {
    return <p className="text-gray-500 mt-4">Verificando estado de calificación...</p>;
  }

  if (alreadyRated) {
    return <p className="text-green-700 mt-4">✅ Ya calificaste este hotel. ¡Gracias por tu opinión!</p>;
  }

  return (
    <div className="mt-4 p-4 border rounded bg-white shadow-sm max-w-md">
      <p className="font-semibold mb-2">Califica este hotel:</p>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            disabled={submitting}
            className={`text-2xl transition ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="¿Quieres dejar un comentario? (opcional)"
        className="w-full border rounded p-2 text-sm text-gray-700 mb-2"
        rows={4}
        disabled={submitting}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
      >
        {submitting ? "Enviando..." : "Enviar reseña"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
