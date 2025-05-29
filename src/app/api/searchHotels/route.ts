import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// Cache in-memory con TTL de 1 hora
const cache = new Map<string, { data: any; expiresAt: number }>();
const TTL = 1000 * 60 * 60; // 1 hora

export async function GET(req: NextRequest) {
  const query = new URL(req.url).searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Falta el parámetro query' }), { status: 400 });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === 'no') {
    return new Response(JSON.stringify({ error: 'GOOGLE_API_KEY no válida o no definida.' }), { status: 500 });
  }

  const now = Date.now();

  // Revisar si hay cache válida
  const cached = cache.get(query);
  if (cached && cached.expiresAt > now) {
    console.log(`⚡ Respuesta desde caché para query: ${query}`);
    return Response.json(cached.data);
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
      photoReference: hotel.photos?.[0]?.photo_reference || null,
    }));

    // 💾 Guardar en cache
    cache.set(query, { data: hoteles, expiresAt: now + TTL });

    // 🧼 Limpiar después de 1 hora automáticamente
    setTimeout(() => {
      cache.delete(query);
      console.log(`🧹 Cache expirada para: ${query}`);
    }, TTL);

    console.log(`🌐 Respuesta desde Google API para query: ${query}`);
    return Response.json(hoteles);
  } catch (err) {
    console.error("❌ Error en la conexión con Google Places:", err);
    return new Response(JSON.stringify({ error: 'Error al conectar con Google Places' }), { status: 500 });
  }
}
