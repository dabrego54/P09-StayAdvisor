import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const input = new URL(req.url).searchParams.get('input');

  if (!input || input.trim().length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(input + ' hotel')}&type=lodging&region=cl&key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') {
      console.warn('Google Autocomplete error:', data.status);
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = data.predictions.map((p: any) => ({
      description: p.description,
      placeId: p.place_id,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error en Autocomplete:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
