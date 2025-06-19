import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';

export async function GET() {
  await connectDB();

  try {
    const reservas = await Reserva.find({});

    const hotelesMap = new Map<string, { hotelName: string, hotelPlaceId: string }>();

    reservas.forEach((r) => {
      if (!hotelesMap.has(r.hotelPlaceId)) {
        hotelesMap.set(r.hotelPlaceId, {
          hotelName: r.hotelName,
          hotelPlaceId: r.hotelPlaceId,
        });
      }
    });

    const hoteles = Array.from(hotelesMap.values());

    return NextResponse.json({ success: true, hoteles });
  } catch (error) {
    console.error('Error al obtener hoteles con reservas', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
