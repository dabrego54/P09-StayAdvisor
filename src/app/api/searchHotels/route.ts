// src/app/api/searchHotels/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Falta el parámetro query' }), { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'no') {
    return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY no válida o no definida.' }), { status: 500 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&region=cl&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return new Response(JSON.stringify({ error: 'No se encontraron hoteles.', status: data.status }), { status: 404 });
    }

    const hoteles = data.results.map((hotel: any) => ({
      name: hotel.name,
      address: hotel.formatted_address,
      rating: hotel.rating,
      totalRatings: hotel.user_ratings_total,
      placeId: hotel.place_id,
      location: hotel.geometry.location,
      photoReference: hotel.photos?.[0]?.photo_reference || null
    }));

    return Response.json(hoteles);
  } catch (err) {
    console.error("❌ Error en la conexión con Google Places:", err);
    return new Response(JSON.stringify({ error: 'Error al conectar con Google Places' }), { status: 500 });
  }
}
