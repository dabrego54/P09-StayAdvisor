import { useEffect, useState } from 'react';

interface Hotel {
  id: number;
  name: string;
  location: string;
  experience: string;
  price: number;
}

interface FeaturedHotelProps {
  hotels: Hotel[];
}

export default function FeaturedHotel({ hotels }: FeaturedHotelProps) {
  const [featuredHotel, setFeaturedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    // Randomly select a featured hotel
    if (hotels.length > 0) {
      const randomIndex = Math.floor(Math.random() * hotels.length);
      setFeaturedHotel(hotels[randomIndex]);
    }
  }, [hotels]);

  if (!featuredHotel) return null;

  return (
    <div className="border-4 border-blue-600 rounded-lg shadow-lg p-8 bg-white mb-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Mejor Calificado</h2>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{featuredHotel.name}</h3>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Ubicación:</span> {featuredHotel.location}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Experiencia:</span> {featuredHotel.experience}
      </p>
      <p className="text-gray-800 font-semibold">
        <span className="text-blue-600">$</span> {featuredHotel.price} por noche
      </p>
    </div>
  );
}