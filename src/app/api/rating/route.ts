import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review'; 

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let payload;
    try {
      payload = verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    const userId = payload.id;
    const { hotelPlaceId, rating } = await req.json();

    if (!hotelPlaceId || typeof rating !== 'number') {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La calificación debe estar entre 1 y 5' }, { status: 400 });
    }

    const exists = await Review.findOne({ userId, hotelPlaceId });
    if (exists) {
      return NextResponse.json({ error: 'Ya calificaste este hotel' }, { status: 409 });
    }

    await Review.create({
      userId,
      hotelPlaceId,
      rating,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Error al calificar hotel:', err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let payload;
    try {
      payload = verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
    }

    const userId = payload.id;
    const placeId = req.nextUrl.searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json({ error: 'Falta el parámetro placeId' }, { status: 400 });
    }

    const exists = await Review.findOne({ userId, hotelPlaceId: placeId });
    return NextResponse.json({ alreadyRated: !!exists }, { status: 200 });
  } catch (err) {
    console.error("Error al verificar calificación previa:", err);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

