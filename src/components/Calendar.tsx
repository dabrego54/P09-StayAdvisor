'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {
  fechasOcupadas: Record<string, string>; // Ej: { "2025-06-22": "Daniel Abrego" }
};

// Convierte cualquier entrada a string "YYYY-MM-DD"
function formatToYMD(input: unknown): string {
  const date = new Date(input as Date);
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
}


export default function CustomCalendar({ fechasOcupadas }: Props) {
  const bookedDates = Object.keys(fechasOcupadas);
  const bookedSet = new Set(bookedDates);

  return (
    <DayPicker
      mode="single"
      modifiers={{
        booked: (date) => bookedSet.has(formatToYMD(date)),
      }}
      modifiersStyles={{
        booked: {
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '6px',
        },
      }}
      components={{
        Day: ({ day, modifiers, ...rest }) => {
          const dateStr = formatToYMD(day);
          const isBooked = bookedSet.has(dateStr);

          return (
            <div {...rest} title={isBooked ? fechasOcupadas[dateStr] : ''}>
              {rest.children}
            </div>
          );
        },
      }}
    />
  );
}
