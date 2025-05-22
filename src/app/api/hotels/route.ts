import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import  HotelModel  from '@/models/Hotel';

export async function GET() {
  try {
    await connectDB();
    const hotels = await HotelModel.find().lean();

    return NextResponse.json({
      success: true,
      hotels,
    });
  } catch (error) {
    console.error('Error al traer hoteles:', error);
    return NextResponse.json({
      success: false,
      message: 'Error trayendo hoteles',
    }, { status: 500 });
  }
}
