import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';

export async function GET(req: NextRequest) {
  await connectDB();

  const placeId = req.nextUrl.searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ success: false, message: 'Falta placeId' }, { status: 400 });
  }

  try {
    const reservas = await Reserva.find({ hotelPlaceId: placeId });

    // Generar lista de fechas ocupadas
    const bookedDates: string[] = [];

    for (const reserva of reservas) {
      const checkIn = new Date(reserva.checkIn);
      const checkOut = new Date(reserva.checkOut);

      for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
        bookedDates.push(new Date(d).toISOString().split('T')[0]);
      }
    }

    return NextResponse.json({ success: true, bookedDates });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
