import Image from 'next/image';
import type { HotelReal } from '@/types/HotelReal';

type Props = {
  hotel: HotelReal;
  apiKey: string;
};

export default function HotelCard({ hotel, apiKey }: Props) {
  const photoUrl = hotel.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photoReference}&key=${apiKey}`
    : '/default-hotel.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-blue-700 mb-2">{hotel.name}</h3>
        <div className="relative w-full h-40 rounded-md overflow-hidden mb-3">
          <Image
            src={photoUrl}
            alt={hotel.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>

        <p className="text-sm text-gray-600 mb-1">{hotel.address}</p>
        <p className="text-sm text-gray-700 mb-2">⭐ {hotel.rating} ({hotel.totalRatings} opiniones)</p>
      </div>

      <button className="mt-2 bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition">
        Reservar
      </button>
    </div>
  );
}
