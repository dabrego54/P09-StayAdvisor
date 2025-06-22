// /components/DisponibilidadForm.tsx

'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface Props {
  placeId: string;
  onUpdate: () => void; // Para refrescar calendario
}

export default function DisponibilidadForm({ placeId, onUpdate }: Props) {
  const [fechasOcupadas, setFechasOcupadas] = useState<string[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar fechas ocupadas actuales desde la API
  useEffect(() => {
    const fetchFechas = async () => {
      try {
        const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
        const data = await res.json();
        const ocupadas = Object.keys(data.fechasOcupadas || {});
        setFechasOcupadas(ocupadas);
        setSeleccionadas(ocupadas.map((f) => dayjs(f, 'YYYY-MM-DD').toDate()));
      } catch (err) {
        console.error(err);
        toast.error('No se pudo cargar la disponibilidad');
      }
    };
    fetchFechas();
  }, [placeId]);

  const handleSubmit = async () => {
    const nuevasFechas = seleccionadas.map((f) => dayjs(f).format('YYYY-MM-DD'));
    const agregar = nuevasFechas.filter((f) => !fechasOcupadas.includes(f));
    const eliminar = fechasOcupadas.filter((f) => !nuevasFechas.includes(f));

    if (agregar.length === 0 && eliminar.length === 0) {
      toast('Sin cambios en la disponibilidad');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/disponibilidad', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, agregar, eliminar }),
      });

      if (!res.ok) throw new Error();

      toast.success('Disponibilidad actualizada correctamente');
      onUpdate();
    } catch {
      toast.error('Error al actualizar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Editar disponibilidad</h3>
      <p className="text-sm text-gray-500 mb-2">
        Selecciona las fechas que estarán ocupadas. Haz clic nuevamente para desmarcar.
      </p>

      <DatePicker
        multiple
        value={seleccionadas}
        onChange={setSeleccionadas}
        format="YYYY-MM-DD"
        className="w-full mb-4"
        sort
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Fechas ocupadas actuales:</strong></p>
        <ul className="list-disc list-inside text-xs mt-1 text-gray-500">
          {seleccionadas.length === 0 ? (
            <li>Sin fechas seleccionadas</li>
          ) : (
            seleccionadas.map((f) => (
              <li key={f.toString()}>{dayjs(f).format('dddd DD MMM YYYY')}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
