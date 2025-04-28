'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  if (user === null) {
    // No logueado
    return (
      <header className="w-full px-6 py-4 flex justify-between items-center shadow-sm bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">StayAdvisor</h1>
        <Link
          href="/login"
          className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
        >
          Iniciar sesión / Registro
        </Link>
      </header>
    );
  }

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center shadow-sm bg-white sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-blue-600">StayAdvisor</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Hola, {user.name.split(' ')[0]}</span>
        <button
          onClick={logout}
          className="text-sm px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-100 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
