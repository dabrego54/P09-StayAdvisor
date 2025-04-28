'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegistering && !name)) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch(isRegistering ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegistering
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Error en la autenticación.');
        return;
      }

      if (isRegistering) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setIsRegistering(false);
        setName('');
        setEmail('');
        setPassword('');
        return;
      }

      login(data.user);

      setTimeout(() => {
        window.location.href = '/search';
      }, 100);

    } catch (err) {
      console.error('Error en el login:', err);
      setError('Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
          {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition text-sm sm:text-base"
          >
            {isRegistering ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-xs sm:text-sm"
          >
            {isRegistering
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </button>

          <div>
            <button
              onClick={() => window.location.href = '/'}
              className="text-blue-600 hover:underline text-xs sm:text-sm"
            >
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
