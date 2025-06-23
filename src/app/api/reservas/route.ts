import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import DisponibilidadManual from '@/models/DisponibilidadManual';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { hotelPlaceId, contactName, checkIn, checkOut, preferencias } = body;

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

export async function PUT(req: NextRequest) {
  await connectDB();

  try {
    const { reservaId, nuevoCheckIn, nuevoCheckOut } = await req.json();

    if (!reservaId || !nuevoCheckIn || !nuevoCheckOut) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    const reservaActual = await Reserva.findById(reservaId);
    if (!reservaActual) {
      return NextResponse.json({ success: false, message: 'Reserva no encontrada' }, { status: 404 });
    }

    const placeId = reservaActual.hotelPlaceId;

    // Construir fechas del nuevo rango
    const fechasNuevas: string[] = [];
    const start = new Date(nuevoCheckIn);
    const end = new Date(nuevoCheckOut);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      fechasNuevas.push(new Date(d).toISOString().split('T')[0]);
    }

    // Validar contra DisponibilidadManual
    const bloqueos = await DisponibilidadManual.findOne({ placeId });
    const conflictoManual = fechasNuevas.find((f) => bloqueos?.fechas.includes(f));
    if (conflictoManual) {
      return NextResponse.json({
        success: false,
        message: `La fecha ${conflictoManual} está bloqueada manualmente.`,
      }, { status: 409 });
    }

    // Validar contra otras reservas (excluyendo la actual)
    const reservas = await Reserva.find({
      hotelPlaceId: placeId,
      _id: { $ne: reservaId },
    });

    for (const r of reservas) {
      const rInicio = new Date(r.checkIn);
      const rFin = new Date(r.checkOut);

      for (let d = new Date(rInicio); d <= rFin; d.setDate(d.getDate() + 1)) {
        const fechaStr = new Date(d).toISOString().split('T')[0];
        if (fechasNuevas.includes(fechaStr)) {
          return NextResponse.json({
            success: false,
            message: `Conflicto con otra reserva en la fecha ${fechaStr}.`,
          }, { status: 409 });
        }
      }
    }

    // Actualizar reserva
    reservaActual.checkIn = nuevoCheckIn;
    reservaActual.checkOut = nuevoCheckOut;
    await reservaActual.save();

    return NextResponse.json({ success: true, message: 'Reserva modificada exitosamente.' });
  } catch (error) {
    console.error('Error al modificar reserva:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  const placeId = req.nextUrl.searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ success: false, message: 'Falta placeId' }, { status: 400 });
  }

  try {
    const reservas = await Reserva.find({ hotelPlaceId: placeId }).select(
  '_id contactName checkIn checkOut preferencias'
  );


    return NextResponse.json({ success: true, reservas });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
