import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Hotel from '@/models/Hotel';

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { placeId, welcomeMessage } = await req.json();

    if (!placeId || welcomeMessage === undefined) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    const hotel = await Hotel.findOneAndUpdate(
      { placeId },
      { welcomeMessage },
      { new: true }
    );

    if (!hotel) {
      return NextResponse.json({ success: false, message: 'Hotel no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Mensaje actualizado', hotel });
  } catch (error) {
    console.error('Error actualizando welcomeMessage:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
