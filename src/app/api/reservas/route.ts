import { NextResponse } from 'next/server';
import ReservaModel from '@/models/Reserva';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validación básica
    if (!data.hotel || !data.user || !data.fechaInicio || !data.fechaFin) {
      return NextResponse.json({ success: false, message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    const reserva = await ReservaModel.create({
      hotel: data.hotel,
      user: data.user,
      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,
    });

    return NextResponse.json({ success: true, reserva });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error al guardar la reserva.' }, { status: 500 });
  }
}