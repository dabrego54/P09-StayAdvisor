import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';

export async function POST(req: NextRequest) {
  await connectDB();

  const { hotelPlaceId, checkIn, checkOut } = await req.json();
  if (!hotelPlaceId || !checkIn || !checkOut) {
    return NextResponse.json({ message: 'Datos incompletos' }, { status: 400 });
  }

  const reservas = await Reserva.find({
    hotelPlaceId,
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  });

  const disponible = reservas.length === 0;

  return NextResponse.json({ disponible });
}
