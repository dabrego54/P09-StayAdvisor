'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface Props {
  reservaId: string;
  nombre: string;
  checkIn: string;
  checkOut: string;
  onSuccess?: () => void;
  placeId: string; // ← necesario para verificar disponibilidad manual
}

export default function ReservaEditorCard({
  reservaId,
  nombre,
  checkIn,
  checkOut,
  onSuccess,
  placeId,
}: Props) {
  const [nuevasFechas, setNuevasFechas] = useState<any[]>([
    dayjs(checkIn).toDate(),
    dayjs(checkOut).toDate(),
  ]);
  const [loading, setLoading] = useState(false);
  const [estado, setEstado] = useState<'ok' | 'conflicto' | 'desconocido'>('desconocido');

  // Verificar si hay conflicto con fechas manuales
  useEffect(() => {
    const verificarConflicto = async () => {
      try {
        const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
        const data = await res.json();

        const manuales = Object.entries(data.fechasOcupadas || {})
          .filter(([, contacto]) => contacto === 'Marcado manualmente')
          .map(([fecha]) => fecha);

        const fechasReserva: string[] = [];
        const d1 = new Date(checkIn);
        const d2 = new Date(checkOut);
        for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
          fechasReserva.push(d.toISOString().split('T')[0]);
        }

        const conflicto = fechasReserva.some((f) => manuales.includes(f));
        setEstado(conflicto ? 'conflicto' : 'ok');
      } catch {
        setEstado('desconocido');
      }
    };

    verificarConflicto();
  }, [checkIn, checkOut, placeId]);

  const handleActualizar = async () => {
    if (nuevasFechas.length !== 2) {
      toast.error('Selecciona un rango de fechas válido.');
      return;
    }

    const nuevoCheckIn = dayjs(nuevasFechas[0]).format('YYYY-MM-DD');
    const nuevoCheckOut = dayjs(nuevasFechas[1]).format('YYYY-MM-DD');

    setLoading(true);
    try {
      const res = await fetch('/api/reservas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservaId, nuevoCheckIn, nuevoCheckOut }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.error(data.message || 'La reserva no puede modificarse por conflicto de fechas.');
        return;
      }

      if (!res.ok) throw new Error();

      toast.success('Reserva modificada exitosamente.');
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error inesperado al modificar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{nombre}</h3>
      <p className="text-sm text-gray-500 mb-1">
        Rango actual: {dayjs(checkIn).format('DD MMM')} → {dayjs(checkOut).format('DD MMM')}
      </p>

      {estado === 'conflicto' && (
        <p className="text-sm font-medium text-red-600 mb-2">⚠️ Conflicto con fechas bloqueadas</p>
      )}
      {estado === 'ok' && (
        <p className="text-sm font-medium text-green-600 mb-2">🟢 Sin conflictos detectados</p>
      )}

      <DatePicker
        value={nuevasFechas}
        onChange={setNuevasFechas}
        format="YYYY-MM-DD"
        range
        className="mb-3"
      />

      <button
        onClick={handleActualizar}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? 'Actualizando...' : 'Actualizar reserva'}
      </button>
    </div>
  );
}
