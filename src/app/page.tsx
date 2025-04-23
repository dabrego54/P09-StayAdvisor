// src/app/page.tsx 

'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <header className="w-full px-6 py-4 flex justify-between items-center shadow-sm bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">StayAdvisor</h1>
        <Link
          href="/login"
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
        >
          Iniciar sesión / Registrarse
        </Link>
      </header>

      <main className="px-6 py-20 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold leading-snug mb-6">
          Explora experiencias únicas<br />en hoteles boutique de Chile
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Descubre alojamientos seleccionados que combinan estilo, exclusividad y calidez. Planifica tu próxima escapada con una plataforma hecha para ti.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/search"
            className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Buscar Hoteles
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-blue-600 text-blue-600 text-lg font-medium rounded-lg hover:bg-blue-50 transition"
          >
            Iniciar sesión / Registro
          </Link>
        </div>
      </main>

      <section className="bg-white py-16 mt-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Hoteles seleccionados</h3>
            <p>Solo alojamientos boutique con altos estándares de calidad, diseño y servicio.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Experiencias personalizadas</h3>
            <p>Elige por tipo de experiencia: naturaleza, lujo, costa o montaña. Tú decides cómo quieres viajar.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Reservas en minutos</h3>
            <p>Con nuestro sistema ágil y simple, reservas en pocos pasos y sin complicaciones.</p>
          </div>
        </div>
      </section>

      <footer className="mt-20 py-8 border-t text-center text-sm text-gray-400">
        © {new Date().getFullYear()} StayAdvisor — Todos los derechos reservados.
      </footer>
    </div>
  );
}