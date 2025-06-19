'use client';

import { DayPicker } from 'react-day-picker';
//import 'react-day-picker/dist/style.css';

type CalendarProps = {
  bookedDates: string[];
};

export default function Calendar({ bookedDates }: CalendarProps) {
  const disabledDays = bookedDates.map(date => new Date(date));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 w-full max-w-md mx-auto">
      <DayPicker
        mode="single"
        selected={undefined}
        disabled={disabledDays}
        modifiers={{ booked: disabledDays }}
        modifiersClassNames={{ booked: 'bg-red-500 text-white' }}
        showOutsideDays
      />
    </div>
  );
}
