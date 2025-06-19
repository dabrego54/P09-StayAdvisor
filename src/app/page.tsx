// src/app/page.tsx

'use client';

import Header from '@/components/header';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white text-gray-800 flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 py-12 sm:py-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-snug mb-6">
          Explora experiencias únicas<br />en hoteles boutique de Chile
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10">
          Descubre alojamientos seleccionados que combinan estilo, exclusividad y calidez. Planifica tu próxima escapada con una plataforma hecha para ti.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/search"
            className="px-6 py-3 bg-blue-600 text-white text-base sm:text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition text-center"
          >
            Buscar Hoteles
          </Link>
        </div>
      </main>

      <section className="bg-white py-12 sm:py-16 mt-10 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-700">Hoteles seleccionados</h3>
            <p className="text-sm sm:text-base">Solo alojamientos boutique con altos estándares de calidad, diseño y servicio.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-700">Experiencias personalizadas</h3>
            <p className="text-sm sm:text-base">Elige por tipo de experiencia: naturaleza, lujo, costa o montaña. Tú decides cómo quieres viajar.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-700">Reservas en minutos</h3>
            <p className="text-sm sm:text-base">Con nuestro sistema ágil y simple, reservas en pocos pasos y sin complicaciones.</p>
          </div>
        </div>
      </section>

      <footer className="mt-12 sm:mt-20 py-6 sm:py-8 border-t text-center text-xs sm:text-sm text-gray-400">
        © {new Date().getFullYear()} StayAdvisor — Todos los derechos reservados.
      </footer>
    </div>
  );
}
