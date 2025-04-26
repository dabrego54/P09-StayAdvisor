'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return null; // evita parpadeo mientras carga el estado
  }

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center shadow-sm bg-white sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-blue-600">StayAdvisor</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hola, {user.name.split(' ')[0]}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
        >
          Iniciar sesión / Registro
        </Link>
      )}
    </header>
  );
}
