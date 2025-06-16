import { useEffect, useState } from "react";

interface Review {
  _id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

interface InternalReview {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
}

interface ReviewListProps {
  placeId: string;
  onClose?: () => void;
}

export default function ReviewList({ placeId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [internalReviews, setInternalReviews] = useState<InternalReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Reseñas externas (Google)
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/reviews?placeId=${placeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reseñas");
        return res.json();
      })
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [placeId]);

  // 🔸 Reseñas internas (MongoDB)
  useEffect(() => {
    const fetchInternal = async () => {
      try {
        const res = await fetch(`/api/ratings/byHotel/${placeId}`);
        const data = await res.json();
        setInternalReviews(data || []);
      } catch (err) {
        console.error("Error al cargar reseñas internas:", err);
      }
    };

    fetchInternal();
  }, [placeId]);

  if (loading) return <p className="text-center text-gray-500">Cargando reseñas...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const noExternal = !reviews.length;
  const noInternal = !internalReviews.length;

  if (noExternal && noInternal)
    return <p className="text-center text-gray-400">No hay reseñas para este hotel.</p>;

  return (
    <div className="mt-4 space-y-4">

      {/* 🔹 Reseñas externas */}
      {reviews.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-gray-700">Opiniones en Google:</h3>
          {reviews.slice(0, 5).map((review) => (
            <div key={review._id} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-blue-700">{review.author}</span>
                <span className="text-yellow-500">⭐ {review.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </>
      )}

      {/* 🔸 Reseñas internas */}
      {internalReviews.length > 0 && (
        <>
          <h3 className="text-sm font-bold text-gray-700 mt-6">
            Opiniones de usuarios StayAdvisor:
          </h3>
          {internalReviews.map((r) => (
            <div
              key={r._id}
              className="border rounded p-3 bg-white shadow-sm text-sm text-gray-800"
            >
              <p className="font-semibold mb-1">⭐ {r.rating} estrellas</p>
              {r.comment && <p className="italic text-gray-600">“{r.comment}”</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
