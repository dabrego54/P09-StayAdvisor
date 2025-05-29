import { HotelReal } from '@/types/HotelReal';

export async function fetchRealHotels(query: string): Promise<HotelReal[]> {
  try {
    const res = await fetch(`/api/searchHotels?query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      console.error('❌ Error en la respuesta de la API de hoteles:', data);
      return [];
    }

    return data as HotelReal[];
  } catch (error) {
    console.error('❌ Error al conectar con la API de búsqueda:', error);
    return [];
  }
}
