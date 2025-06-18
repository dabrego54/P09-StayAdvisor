'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState , useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      toast.success('Sesión cerrada exitosamente.');
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Ocurrió un error al cerrar sesión.');
    }
  };

  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'hotelero':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
          StayAdvisor
        </Link>

        {/* Navegación */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-blue-700 transition"
            >
              <div className="text-sm text-gray-600">¡Hola, {user.name.split(' ')[0]}!</div>

              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <span
                className={`px-2 py-0.5 text-xs rounded-full font-semibold whitespace-nowrap ${getRoleStyles(user.role)}`}
              >
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="px-4 py-2 text-sm text-gray-600">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
          >
            Iniciar sesión / Registro
          </Link>
        )}
      </div>
    </header>
  );
}
