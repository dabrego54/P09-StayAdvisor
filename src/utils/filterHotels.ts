import type { HotelReal } from '@/types/HotelReal';

interface Filters {
  experience?: string; // Se deja en la interfaz por compatibilidad, pero no se usa
  services?: string[]; // Idem
  searchText?: string;
}

export function filterHotels(hotels: HotelReal[], filters: Filters): HotelReal[] {
  const { searchText = '' } = filters;

  return hotels.filter((hotel) => {
    const matchText =
      hotel.name.toLowerCase().includes(searchText.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchText.toLowerCase());

    return matchText;
  });
}
