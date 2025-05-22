'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Hotel } from '@/types/Hotel';

interface HotelCardProps {
  hotel: Hotel;
}

const serviceIcons: Record<string, string> = {
  Wifi: '📶',
  Desayuno: '🥐',
  Piscina: '🏊‍♂️',
  Spa: '💆‍♀️',
};

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
      <h3 className="text-lg font-bold text-blue-800">{hotel.name}</h3>

      {hotel.image ? (
        <Image
          src={hotel.image}
          alt={`Imagen de ${hotel.name}`}
          width={300}
          height={200}
          className="rounded-lg object-cover mt-2"
          priority={false}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg mt-2 flex items-center justify-center text-gray-500 text-sm">
          Sin imagen
        </div>
      )}

      <p className="text-sm text-gray-600 mt-2">
        {hotel.location} — {hotel.experience}
      </p>

      <p className="text-sm text-gray-800 font-medium mt-1">${hotel.price} por noche</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {hotel.services.map((service) => (
          <span
            key={service}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full"
            title={service}
          >
            <span>{serviceIcons[service] || '❓'}</span> {service}
          </span>
        ))}
      </div>

      <Link href={`/reserva?hotelId=${hotel.id}`}>
        <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 hover:shadow-lg transition-transform transition-shadow duration-300 transform hover:scale-105 active:scale-95 text-sm">
          Reservar
        </button>
      </Link>
    </div>
  );
}
