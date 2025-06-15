import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userId, hotelPlaceId } = await req.json();

    if (!userId || !hotelPlaceId) {
      return NextResponse.json({ hasReservation: false });
    }

    const objectId = new mongoose.Types.ObjectId(userId); // 👈 esto es correcto

    const reserva = await Reserva.findOne({
      userId: objectId, // 👈 comparación directa como ObjectId
      hotelPlaceId: hotelPlaceId,
    });

    console.log('🔎 Consulta enviada a Mongo:', { userId: objectId, hotelPlaceId });
    console.log('🔎 Resultado:', reserva);

    return NextResponse.json({ hasReservation: !!reserva });
  } catch (error) {
    console.error('Error verificando reserva:', error);
    return NextResponse.json({ hasReservation: false });
  }
}
