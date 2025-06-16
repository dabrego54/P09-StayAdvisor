import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import RatingInterno from '@/models/RatingInterno';
import { getCombinedRating } from '@/utils/getCombinedRating';
import {
  getCachedHotels,
  setCachedHotels,
} from '@/utils/cacheHotelSearch';

export const runtime = 'nodejs';

// TTL desde variable de entorno (default: 1h)
const TTL = parseInt(process.env.HOTEL_CACHE_TTL_MS || '3600000');

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Falta el parámetro query' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'no') {
    return NextResponse.json({ error: 'GOOGLE_API_KEY no válida o no definida.' }, { status: 500 });
  }

  // 🧠 Verificar caché antes de llamar a Google
  const cached = getCachedHotels(query);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&region=cl&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: 'No se encontraron hoteles.', status: data.status }, { status: 404 });
    }

    await connectDB();

    const hoteles = await Promise.all(
      data.results.map(async (hotel: any) => {
        const placeId = hotel.place_id;
        const ratingExterna = hotel.rating;

        const internos = await RatingInterno.find({ hotelPlaceId: placeId });

        const internalRatingCount = internos.length;
        const internalRatingAvg = internalRatingCount
          ? internos.reduce((sum, r) => sum + r.rating, 0) / internalRatingCount
          : null;

        const combinedRating =
          internalRatingAvg !== null
            ? getCombinedRating(internalRatingAvg, ratingExterna)
            : ratingExterna;

        console.log(`🏨 ${hotel.name} → externa: ${ratingExterna}, interna: ${internalRatingAvg ?? 'N/A'}, combinada: ${combinedRating.toFixed(2)}`);

        return {
          name: hotel.name,
          address: hotel.formatted_address,
          rating: ratingExterna,
          combinedRating,
          internalRatingAvg,
          internalRatingCount,
          totalRatings: hotel.user_ratings_total,
          placeId,
          location: hotel.geometry.location,
          photoReference: hotel.photos?.[0]?.photo_reference || null,
        };
      })
    );

    // 💾 Guardar en caché
    setCachedHotels(query, hoteles, TTL);

    return NextResponse.json(hoteles);
  } catch (err) {
    console.error('❌ Error en la conexión con Google Places o MongoDB:', err);
    return NextResponse.json({ error: 'Error al conectar con Google Places o MongoDB' }, { status: 500 });
  }
}
