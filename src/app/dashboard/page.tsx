// /src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'hotelero' && user.role !== 'admin') {
      router.push('/search'); // acceso denegado
    }
  }, [user, router]);

  if (!user || (user.role !== 'hotelero' && user.role !== 'admin')) return null;

  const hotelAsignado = {
    nombre: 'Hotel Boutique Andes',
    ubicacion: 'Valparaíso, Chile',
    disponibilidad: 'Disponible',
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard de Hotelero</h1>
          <p className="text-sm text-gray-600 mt-1">
            Bienvenido, <span className="font-semibold text-blue-600">{user.name}</span> (
            <span className="capitalize text-gray-700">{user.role}</span>)
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Hotel asignado</h2>
          <p><strong>Nombre:</strong> {hotelAsignado.nombre}</p>
          <p><strong>Ubicación:</strong> {hotelAsignado.ubicacion}</p>
          <p><strong>Estado:</strong> <span className="text-green-600 font-semibold">{hotelAsignado.disponibilidad}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Gestionar Disponibilidad
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
            Ver Calendario
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
            Editar Hotel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Eliminar Hotel
          </button>
        </div>
      </div>
    </main>
  );
}
