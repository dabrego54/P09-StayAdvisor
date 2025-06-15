import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import RatingInterno from '@/models/RatingInterno';
import Reserva from '@/models/Reserva'; // Asegúrate de tener este modelo
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { hotelPlaceId, userId, rating, comment } = body;

    if (!hotelPlaceId || !userId || !rating) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // ✅ Validar que exista una reserva previa
    const existingReserva = await Reserva.findOne({
      userId: objectId,
      hotelPlaceId,
    });

    if (!existingReserva) {
      return NextResponse.json(
        { message: 'Debes haber reservado este hotel para poder calificar.' },
        { status: 403 }
      );
    }

    const nuevoRating = new RatingInterno({
      hotelPlaceId,
      userId: objectId,
      rating,
      comment: comment || '',
    });

    await nuevoRating.save();

    return NextResponse.json({ message: 'Calificación guardada exitosamente' }, { status: 201 });
  } catch (error: any) {
    console.error('Error al guardar calificación:', error.message);

    if (error.code === 11000) {
      return NextResponse.json({ message: 'Ya calificaste este hotel' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
