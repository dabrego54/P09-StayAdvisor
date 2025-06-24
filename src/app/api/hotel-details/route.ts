// /api/hotel-details/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return new Response(JSON.stringify({ error: 'Missing placeId' }), { status: 400 });
  }

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;

  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'Google API key not configured' }), { status: 500 });
  }

  try {
    const fields = [
      'name',
      'formatted_address',
      'vicinity',
      'rating',
      'user_ratings_total',
      'photos',
      'reviews',
      'geometry',
      'types',
      'website',
      'formatted_phone_number'
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=es&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return new Response(JSON.stringify({ error: 'Hotel not found or invalid placeId', details: data.status }), { status: 404 });
    }

    const result = data.result;

    return new Response(JSON.stringify({
      name: result.name,
      address: result.formatted_address,
      vicinity: result.vicinity ?? '',
      rating: result.rating,
      totalRatings: result.user_ratings_total,
      photos: result.photos || [],
      reviews: result.reviews || [],
      location: result.geometry?.location,
      types: result.types,
      website: result.website,
      phone: result.formatted_phone_number
    }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
  }
}