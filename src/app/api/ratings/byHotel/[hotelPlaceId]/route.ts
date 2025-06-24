import { connectDB } from '@/lib/mongodb';
import RatingInterno from '@/models/RatingInterno';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: any) {
  await connectDB();

  const hotelPlaceId = context.params.hotelPlaceId;

  try {
    const ratings = await RatingInterno.find({ hotelPlaceId });
    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Error al obtener calificaciones internas:', error);
    return NextResponse.json([], { status: 500 });
  }
}
