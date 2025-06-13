import type { HotelReal } from '@/types/HotelReal';

/**
 * Filtra hoteles por ciudad comparando con el campo `address`.
 */
export function filterByCity(hotels: HotelReal[], city: string): HotelReal[] {
  if (!city) return hotels;

  return hotels.filter(hotel =>
    hotel.address.toLowerCase().includes(city.toLowerCase())
  );
}
