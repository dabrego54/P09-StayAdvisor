'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewList from './ReviewList';
import type { HotelReal } from '@/types/HotelReal';
import RatingForm from './RatingForm';

type Props = {
  hotel: HotelReal;
  apiKey: string;
  ranking?: number;
};

export default function HotelCard({ hotel, apiKey, ranking }: Props) {
  const [showReviews, setShowReviews] = useState(false);
  const router = useRouter();

  const photoUrl = hotel.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photoReference}&key=${apiKey}`
    : '/default-hotel.jpg';

  const handleReservar = () => {
    localStorage.setItem('hotelSeleccionado', JSON.stringify(hotel));
    router.push('/reserva');
  };

  return (
    <div className="border rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition flex flex-col relative">
      {/* Ranking badge */}
      {ranking && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow">
          #{ranking}
        </div>
      )}

      <div className="relative w-full h-40 rounded-md overflow-hidden mb-3">
        <Image
          src={photoUrl}
          alt={hotel.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      <h3 className="text-xl font-bold text-blue-800 mb-2">{hotel.name}</h3>

      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Ubicación:</span> {hotel.address}
      </p>

      <div className="text-sm text-gray-500 italic mb-2">
        ⭐ {hotel.rating?.toFixed(1) || '4.5'} / 5.0
      </div>

      <div className="flex justify-between items-center mt-auto pt-2">
        <button
          onClick={handleReservar}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Reservar
        </button>

        <button
          onClick={() => setShowReviews((v) => !v)}
          className="text-sm text-blue-600 hover:underline ml-4"
        >
          {showReviews ? 'Ocultar reseñas' : 'Ver reseñas'}
        </button>
      </div>

      {showReviews && hotel.placeId && (
        <div className="mt-4">
          <ReviewList placeId={hotel.placeId} />
          <RatingForm hotelPlaceId={hotel.placeId} />
        </div>
        
      )}
    </div>
  );
}
