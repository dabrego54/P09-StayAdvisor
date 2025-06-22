'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Props {
  fechasOcupadas: Record<string, string>; // formato 'YYYY-MM-DD': 'Nombre'
}

export default function CalendarSimple({ fechasOcupadas }: Props) {
  const [value, setValue] = useState<Date | null>(new Date());
  const [ocupadas, setOcupadas] = useState<Set<string>>(new Set());

  useEffect(() => {
    setOcupadas(new Set(Object.keys(fechasOcupadas)));
  }, [fechasOcupadas]);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border p-6">
        <Calendar
          onChange={(val) => setValue(val as Date)}
          value={value}
          className="w-full"
          tileClassName={({ date }) => {
            const ymd = formatDate(date);
            return ocupadas.has(ymd)
              ? 'bg-red-100 text-red-700 font-semibold rounded-lg'
              : 'hover:bg-gray-100 transition';
          }}
          tileContent={({ date }) => {
            const ymd = formatDate(date);
            const contacto = fechasOcupadas[ymd];
            return contacto ? (
              <Tippy content={`Reservado por ${contacto}`}>
                <span className="block mt-1 text-[10px] text-red-600 text-center font-medium">
                  {contacto.split(' ')[0]}
                </span>
              </Tippy>
            ) : null;
          }}
        />
      </div>
    </div>
  );
}
