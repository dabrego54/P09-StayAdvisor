import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const reserva = new Reserva({
      hotelName: body.hotelName,
      hotelPlaceId: body.hotelPlaceId,
      userEmail: body.userEmail,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      notes: body.notes,
      createdAt: new Date()
    });

    await reserva.save();

    return NextResponse.json({ message: 'Reserva guardada en MongoDB', success: true }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    return NextResponse.json({ message: 'Error al guardar reserva', success: false }, { status: 500 });
  }
}
