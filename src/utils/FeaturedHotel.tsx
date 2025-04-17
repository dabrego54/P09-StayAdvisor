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
  filteredHotels: Hotel[];
}

export default function FeaturedHotel({ hotels, filteredHotels }: FeaturedHotelProps) {
  const [featuredHotel, setFeaturedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    // Randomly select a featured hotel
    if (hotels.length > 0) {
      const randomIndex = Math.floor(Math.random() * hotels.length);
      setFeaturedHotel(hotels[randomIndex]);
    }
  }, [hotels]);

  // Check if the featured hotel is in the filtered list
  const isFeaturedInFiltered = featuredHotel
    ? filteredHotels.some(hotel => hotel.id === featuredHotel.id)
    : false;

  // Only display the featured hotel if it qualifies under the filters
  if (filteredHotels.length > 0 && !isFeaturedInFiltered) {
    return null; // Do not display the featured hotel if it doesn't match the filters
  }

  // If no featured hotel is selected or no hotels are available, return null
  if (!featuredHotel) return null;

  return (
    <div
      className={`border-4 rounded-lg shadow-lg p-8 mb-8 ${
        isFeaturedInFiltered ? 'border-green-600 bg-green-100' : 'border-blue-600 bg-white'
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isFeaturedInFiltered ? 'text-green-800' : 'text-blue-800'
        }`}
      >
        {isFeaturedInFiltered ? 'Hotel Destacado en Filtros' : 'Mejor Calificado'}
      </h2>
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