import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('placeId');
  if (!placeId) {
    return NextResponse.json({ message: 'Falta placeId' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=review&key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    const reviews = (data.result?.reviews || []).map((review: any, index: number) => ({
      _id: `${placeId}-${index}`,
      author: review.author_name,
      text: review.text,
      rating: review.rating,
      date: review.time ? new Date(review.time * 1000).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json({ message: 'Error al obtener reseñas' }, { status: 500 });
  }
}
