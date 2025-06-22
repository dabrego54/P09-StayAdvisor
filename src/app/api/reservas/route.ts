import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import DisponibilidadManual from '@/models/DisponibilidadManual';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { hotelPlaceId, contactName, checkIn, checkOut } = body;

    if (!hotelPlaceId || !checkIn || !checkOut || !contactName) {
      return NextResponse.json({ success: false, message: 'Datos incompletos' }, { status: 400 });
    }

    // Validación de disponibilidad manual
    const manual = await DisponibilidadManual.findOne({ placeId: hotelPlaceId });

    if (manual?.fechas && manual.fechas.length > 0) {
      const fechasAValidar: string[] = [];
      const dInicio = new Date(checkIn);
      const dFin = new Date(checkOut);

      for (let d = new Date(dInicio); d <= dFin; d.setDate(d.getDate() + 1)) {
        const fechaStr = new Date(d).toISOString().split('T')[0];
        fechasAValidar.push(fechaStr);
      }

      const conflicto = fechasAValidar.find((f) => manual.fechas.includes(f));

      if (conflicto) {
        return NextResponse.json({
          success: false,
          message: `No se puede reservar. La fecha ${conflicto} ya fue marcada como ocupada.`,
        }, { status: 409 });
      }
    }

    // Crear la reserva
    const reserva = await Reserva.create(body);

    return NextResponse.json({ success: true, reserva }, { status: 201 });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
