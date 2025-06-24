import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Rating from '@/models/RatingInterno';
import Reserva from '@/models/Reserva';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { hotelPlaceId, userId, rating, opiniones } = await req.json();

    if (!hotelPlaceId || !userId || !rating) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    // Verificar si el usuario tiene reserva previa
    const reserva = await Reserva.findOne({ hotelPlaceId, userId });
    if (!reserva) {
      return NextResponse.json({ success: false, message: 'No tienes reserva', code: 'NO_RESERVA' }, { status: 403 });
    }

    // Evitar duplicados
    const yaExiste = await Rating.findOne({ hotelPlaceId, userId });
    if (yaExiste) {
      return NextResponse.json({ success: false, message: 'Ya calificaste este hotel' }, { status: 409 });
    }

    const nueva = await Rating.create({
      hotelPlaceId,
      userId,
      rating,
      opiniones,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, rating: nueva });
  } catch (error) {
    console.error('Error al guardar calificación:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
