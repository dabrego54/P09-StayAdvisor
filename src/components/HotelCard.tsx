'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewList from './ReviewList';
import type { HotelReal } from '@/types/HotelReal';

type Props = {
  hotel: HotelReal;
  apiKey: string;
  ranking?: number;
};

export default function HotelCard({ hotel, apiKey, ranking }: Props) {
  const router = useRouter();
  const [showReviews, setShowReviews] = useState(false);

  const photoUrl = hotel.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photoReference}&key=${apiKey}`
    : '/default-hotel.jpg';

  return (
    <div className="border rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition flex flex-col relative">
      {/* Badge de ranking */}
      {ranking && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow">
          #{ranking}
        </div>
      )}

      {/* Imagen del hotel */}
      <div className="relative w-full h-40 rounded-md overflow-hidden mb-3">
        <Image
          src={photoUrl}
          alt={hotel.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      {/* Detalles del hotel */}
      <h3 className="text-xl font-bold text-blue-800 mb-2">{hotel.name}</h3>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Ubicación:</span> {hotel.address}
      </p>

      {/* <p className="text-gray-600 mb-1">
        <span className="font-semibold">Experiencia:</span> {hotel.experience || 'Desconocida'}
      </p> */}

      {/* <p className="text-gray-800 font-semibold mb-4">
        <span className="text-blue-600">$</span> {hotel.price || Math.round(hotel.rating * 10000)} por noche
      </p> */}

      <div className="flex items-center justify-between mt-auto pt-2">
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setShowReviews((v) => !v)}
        >
          {showReviews ? 'Ocultar reseñas' : 'Ver reseñas'}
        </button>
        <span className="text-yellow-500 font-semibold ml-4">
          ⭐ {hotel.rating?.toFixed(1) || '4.5'} / 5.0
        </span>
      </div>

      {showReviews && hotel.placeId && <ReviewList placeId={hotel.placeId} />}

      <button
        className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
        onClick={() => {
          localStorage.setItem('hotelSeleccionado', JSON.stringify({
            name: hotel.name,
            address: hotel.address,
            placeId: hotel.placeId,
            rating: hotel.rating,
            // price: hotel.price || Math.round(hotel.rating * 10000),
            // experience: hotel.experience || "Desconocida",
            photoReference: hotel.photoReference || null,
            totalRatings: hotel.totalRatings,
            location: hotel.location,
          }));

          router.push('/reserva');
        }}
      >
        Reservar
      </button>
    </div>
  );
}
