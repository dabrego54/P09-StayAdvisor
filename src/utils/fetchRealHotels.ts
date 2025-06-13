import type { HotelReal } from '@/types/HotelReal';

export default async function fetchRealHotels(query: string): Promise<HotelReal[]> {
  try {
    const response = await fetch(`/api/searchHotels?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    console.log('📦 Data cruda desde API:', data); // 👈 Verifica esto en consola

    if (!data || !data.results) return [];

    const hoteles: HotelReal[] = data.results
      .filter((result: any) => result.name && result.place_id && result.geometry?.location)
      .map((result: any) => ({
        name: result.name,
        address:
          result.formatted_address ||
          result.vicinity ||
          'Dirección no disponible',
        rating: result.rating || 4.5,
        totalRatings: result.user_ratings_total || 0,
        placeId: result.place_id,
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        photoReference: result.photos?.[0]?.photo_reference || null,
      }));

    console.log('✅ Hoteles mapeados como HotelReal[]:', hoteles);
    return hoteles;
  } catch (err) {
    console.error('❌ Error en fetchRealHotels:', err);
    return [];
  }
}
