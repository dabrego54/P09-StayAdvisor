'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPrivileged = user?.role === 'admin' || user?.role === 'hotelero';

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
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
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-blue-700 dark:text-white tracking-tight">
          StayAdvisor
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-white">Página principal</Link>
          <Link href="/search" className="hover:text-blue-600 dark:hover:text-white">Hoteles</Link>
          <Link href="/nosotros" className="hover:text-blue-600 dark:hover:text-white">Sobre nosotros</Link>
          <Link href="/reservas" className="hover:text-blue-600 dark:hover:text-white">Mis reservas</Link>
        </nav>

        {/* User & theme toggle */}
        <div className="flex items-center gap-4">
          {/* Toggle dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Cambiar tema"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
              >
                <span className="text-gray-700 dark:text-gray-200">¡Hola, {user.name.split(' ')[0]}!</span>
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-500 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleStyles(user.role)}`}>
                  {user.role}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {user.name} <span className="lowercase text-gray-500">({user.role})</span>
                  </div>

                  {isPrivileged && (
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                    >
                      Ir al Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      router.push('/misreservas');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Mis reservas
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
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
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
