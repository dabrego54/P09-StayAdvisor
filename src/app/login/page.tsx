// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || (isRegistering && !name)) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electrónico inválido.');
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
  
      if (!res.ok) {
        setError(data.message || 'Error al procesar la solicitud.');
        return;
      }
  
      if (isRegistering) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setIsRegistering(false);
        setName('');
        setPassword('');
      } else {
        alert(`¡Bienvenido, ${data.user.name}!`);
        // Aquí podrías redirigir a la página principal o dashboard
      }
  
      setEmail('');
      setPassword('');
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error inesperado.');
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm mt-1 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </p>

        <div className="pt-2 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            ← Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}
