import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Feedback from '@/models/feedback';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { hotelPlaceId, userId, rating, opiniones } = await req.json();

    if (!hotelPlaceId || !userId || !rating || !opiniones) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    // Evitar duplicados: 1 feedback por usuario por hotel
    const yaExiste = await Feedback.findOne({ hotelPlaceId, userId });
    if (yaExiste) {
      return NextResponse.json(
        { success: false, message: 'Ya enviaste feedback para este hotel.' },
        { status: 409 }
      );
    }

    const nuevoFeedback = await Feedback.create({
      hotelPlaceId,
      userId,
      rating,
      opiniones,
    });

    return NextResponse.json({ success: true, feedback: nuevoFeedback }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar feedback:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
