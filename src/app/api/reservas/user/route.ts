import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Falta el parámetro userId' }, { status: 400 });
    }

    const reservas = await Reserva.find({ userId });

    return NextResponse.json(reservas);
  } catch (error) {
    console.error('[API][Reservas][User]', error);
    return NextResponse.json({ error: 'Error al obtener reservas del usuario' }, { status: 500 });
  }
}
