import type { Hotel } from '@/types/Hotel';
import type { HotelReal } from '@/types/HotelReal';

/**
 * Filtra hoteles por ciudad (ubicación).
 * Busca la ciudad dentro del campo address o location.
 */
export function filterByCity(
  hotels: (Hotel | HotelReal)[],
  city: string
): (Hotel | HotelReal)[] {
  if (!city) return hotels;
  return hotels.filter(hotel => {
    const address = (hotel as any).address || (hotel as any).location || '';
    return address.toLowerCase().includes(city.toLowerCase());
  });
}