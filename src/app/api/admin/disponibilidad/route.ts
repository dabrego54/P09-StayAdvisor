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

    const fechasOcupadas: Record<string, string> = {};

    for (const reserva of reservas) {
      const checkIn = new Date(reserva.checkIn);
      const checkOut = new Date(reserva.checkOut);
      const nombre = reserva.contactName || 'Reserva';

      for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
        const fechaStr = new Date(d).toISOString().split('T')[0];
        fechasOcupadas[fechaStr] = nombre;
      }
    }

    return NextResponse.json({ success: true, fechasOcupadas });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
