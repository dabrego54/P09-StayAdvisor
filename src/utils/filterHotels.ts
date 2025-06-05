// src/utils/filterHotels.ts
// revisar el cambio

import type { Hotel } from '@/types/Hotel';
import type { HotelReal } from '@/types/HotelReal';

interface FilterCriteria {
  experience?: string;
  services?: string[];
  searchText?: string;
}

/**
 * Permite filtrar tanto hoteles locales (Hotel) como reales (HotelReal).
 */
export function filterHotels(
  hotels: (Hotel | HotelReal)[],
  filters: FilterCriteria
): (Hotel | HotelReal)[] {
  return hotels.filter(hotel => {
    // Experiencia (puede no existir en HotelReal)
    const matchExperience = filters.experience
      ? (hotel as any).experience === filters.experience
      : true;

    // Servicios (puede no existir en HotelReal)
    const matchServices =
      filters.services && filters.services.length > 0
        ? Array.isArray((hotel as any).services) &&
          filters.services.every(s => (hotel as any).services.includes(s))
        : true;

    // Búsqueda por texto (usa name, address/location, experience si existen)
    const searchFields = [
      (hotel as any).name,
      (hotel as any).address || (hotel as any).location,
      (hotel as any).experience,
    ].filter(Boolean);

    const matchSearch = filters.searchText
      ? searchFields.some(field =>
          String(field).toLowerCase().includes(filters.searchText!.toLowerCase())
        )
      : true;

    return matchExperience && matchServices && matchSearch;
  });
}
