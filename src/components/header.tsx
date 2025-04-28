'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; 

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente.');
      router.push('/'); // Redirige al home
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Ocurrió un error al cerrar sesión.');
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 flex-shrink-0">
          StayAdvisor
        </Link>

        {/* Navegación */}
        {user === null ? (
          <Link
            href="/login"
            className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition whitespace-nowrap"
          >
            Iniciar sesión / Registro
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">
              Hola, {user.name.split(' ')[0]}
            </span>
            <button
              onClick={handleLogout} 
              className="text-sm px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition whitespace-nowrap"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
