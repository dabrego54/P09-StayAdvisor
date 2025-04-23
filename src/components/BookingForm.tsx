// src/components/BookingForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  onChange: (data: BookingData | null) => void;
}

export type BookingData = {
  checkIn: string;
  checkOut: string;
  guests: number;
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
};

export default function BookingForm({ onChange }: BookingFormProps) {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isFutureDate = (date: string) => new Date(date) >= new Date();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!checkIn) newErrors.checkIn = 'La fecha de entrada es obligatoria';
    else if (!isFutureDate(checkIn)) newErrors.checkIn = 'La fecha de entrada debe ser futura';
    if (!checkOut) newErrors.checkOut = 'La fecha de salida es obligatoria';
    else if (new Date(checkOut) <= new Date(checkIn)) newErrors.checkOut = 'Debe ser posterior a la entrada';
    if (guests < 1) newErrors.guests = 'Debe haber al menos 1 huésped';
    if (fullName.trim().length < 2) newErrors.fullName = 'Nombre demasiado corto';
    if (!isValidEmail(email)) newErrors.email = 'Correo no válido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (validate()) {
      onChange({ checkIn, checkOut, guests, fullName, email, phone, notes });
    } else {
      onChange(null);
    }
  }, [checkIn, checkOut, guests, fullName, email, phone, notes]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const showError = (field: string) => touched[field] && errors[field];

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Reserva tu estadía</h2>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="checkin" className="mb-1 text-sm font-medium text-gray-700">
            Fecha de entrada
          </label>
          <input
            id="checkin"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            onBlur={() => handleBlur('checkIn')}
            className="rounded-lg border p-3 text-gray-800 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {showError('checkIn') && <p className="text-sm text-red-600 mt-1">{errors.checkIn}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="checkout" className="mb-1 text-sm font-medium text-gray-700">
            Fecha de salida
          </label>
          <input
            id="checkout"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            onBlur={() => handleBlur('checkOut')}
            className="rounded-lg border p-3 text-gray-800 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {showError('checkOut') && <p className="text-sm text-red-600 mt-1">{errors.checkOut}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="guests" className="mb-1 text-sm font-medium text-gray-700">
            Huéspedes
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            onBlur={() => handleBlur('guests')}
            className="rounded-lg border p-3 text-gray-800 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {showError('guests') && <p className="text-sm text-red-600 mt-1">{errors.guests}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="fullName" className="mb-1 text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => handleBlur('fullName')}
            placeholder="Ej: Vicente Köhler"
            className="rounded-lg border p-3 text-gray-800 placeholder-gray-500 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {showError('fullName') && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Ej: vicente@email.com"
            className="rounded-lg border p-3 text-gray-800 placeholder-gray-500 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {showError('email') && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-1 text-sm font-medium text-gray-700">
            Teléfono (opcional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: +56 9 1234 5678"
            className="rounded-lg border p-3 text-gray-800 placeholder-gray-500 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="notes" className="mb-1 text-sm font-medium text-gray-700">
            Comentarios o solicitudes especiales
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Alergia al polvo, viajaré con mascota, etc."
            className="rounded-lg border p-3 text-gray-800 placeholder-gray-500 text-base shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 border border-blue-500 px-5 py-2 rounded-lg hover:bg-blue-50 transition"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  );
}
