import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reserva from '@/models/Reserva';
import DisponibilidadManual from '@/models/DisponibilidadManual';

// ======================
// GET: Obtener disponibilidad combinada
// ======================
export async function GET(req: NextRequest) {
  await connectDB();

  const placeId = req.nextUrl.searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ success: false, message: 'Falta placeId' }, { status: 400 });
  }

  try {
    const fechasOcupadas: Record<string, string> = {};

    // 1. Fechas desde reservas reales
    const reservas = await Reserva.find({ hotelPlaceId: placeId });

    for (const reserva of reservas) {
      const checkIn = new Date(reserva.checkIn);
      const checkOut = new Date(reserva.checkOut);
      const nombre = reserva.contactName || 'Reserva';

      for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
        const fechaStr = new Date(d).toISOString().split('T')[0];
        fechasOcupadas[fechaStr] = nombre;
      }
    }

    // 2. Fechas marcadas manualmente por el hotelero
    const manual = await DisponibilidadManual.findOne({ placeId });

    if (manual?.fechas) {
      for (const fecha of manual.fechas) {
        // No sobrescribas si ya está ocupada por una reserva real
        if (!fechasOcupadas[fecha]) {
          fechasOcupadas[fecha] = 'Marcado manualmente';
        }
      }
    }

    return NextResponse.json({ success: true, fechasOcupadas });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}

// ======================
// PATCH: Actualizar disponibilidad manual
// ======================
export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { placeId, agregar = [], eliminar = [] } = await req.json();

    if (!placeId) {
      return NextResponse.json({ success: false, message: 'Falta placeId' }, { status: 400 });
    }

    const doc = await DisponibilidadManual.findOne({ placeId });

    if (!doc) {
      await DisponibilidadManual.create({
        placeId,
        fechas: agregar,
      });
    } else {
      // Eliminar fechas solicitadas
      doc.fechas = doc.fechas.filter((f: string) => !eliminar.includes(f));
      // Agregar nuevas sin duplicados
      for (const fecha of agregar) {
        if (!doc.fechas.includes(fecha)) {
          doc.fechas.push(fecha);
        }
      }
      await doc.save();
    }

    return NextResponse.json({ success: true, message: 'Disponibilidad actualizada' });
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    return NextResponse.json({ success: false, message: 'Error del servidor' }, { status: 500 });
  }
}
