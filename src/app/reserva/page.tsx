'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReservaPage() {
  const [hotel, setHotel] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [reserva, setReserva] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('reservaHotel');
    if (data) setHotel(JSON.parse(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setReserva(null);

    const res = await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotel,
        user: { nombre, email, telefono },
        fechaInicio,
        fechaFin,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setReserva(data.reserva); // Guarda la reserva para mostrar/impresión
      setMensaje('¡Reserva confirmada!');
      // Si prefieres redirigir, descomenta la siguiente línea:
      // router.push('/confirmacion');
    } else {
      setMensaje(data.message || 'Error al guardar la reserva.');
    }
  };

  if (!hotel) return <p>No hay información de reserva.</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reserva para: {hotel.name}</h1>
      {!reserva ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required className="w-full border p-2 rounded" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input required className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input required className="w-full border p-2 rounded" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
          <input required className="w-full border p-2 rounded" type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          <input required className="w-full border p-2 rounded" type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Confirmar Reserva</button>
          {mensaje && <p className={reserva ? "text-green-600" : "text-red-500"}>{mensaje}</p>}
        </form>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Reserva Confirmada</h2>
          <p><strong>Hotel:</strong> {reserva.hotel.name}</p>
          <p><strong>Dirección:</strong> {reserva.hotel.address}</p>
          <p><strong>Nombre:</strong> {reserva.user.nombre}</p>
          <p><strong>Email:</strong> {reserva.user.email}</p>
          <p><strong>Teléfono:</strong> {reserva.user.telefono}</p>
          <p><strong>Fecha inicio:</strong> {reserva.fechaInicio}</p>
          <p><strong>Fecha fin:</strong> {reserva.fechaFin}</p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.print()}
          >
            Imprimir Reserva
          </button>
        </div>
      )}
    </div>
  );
}
