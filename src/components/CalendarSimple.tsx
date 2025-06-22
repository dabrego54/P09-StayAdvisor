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

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full h-full bg-white rounded-xl shadow border p-4 flex items-center justify-center">
        <Calendar
          onChange={(val) => setValue(val as Date)}
          value={value}
          tileClassName={({ date }) => {
            const ymd = formatDate(date);
            return ocupadas.has(ymd)
              ? 'bg-red-200 text-red-800 font-semibold rounded-lg'
              : '';
          }}
          tileContent={({ date }) => {
            const ymd = formatDate(date);
            const contacto = fechasOcupadas[ymd];
            return contacto ? (
              <Tippy content={`Reservado por ${contacto}`}>
                <span className="block text-[10px] text-red-700 text-center mt-1 font-semibold">
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
