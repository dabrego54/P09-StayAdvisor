// src/app/page.tsx

'use client';

import Header from '@/components/header';
import Link from 'next/link';
import { FaMapMarkedAlt, FaBolt, FaStar } from 'react-icons/fa';
import HotelCarrusel from '@/components/HotelCarrusel';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-b from-[#9dbcf5] via-[#f8f9fc] to-white flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance">
            Vive tus vacaciones con estilo.
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-800 max-w-2xl mx-auto text-balance">
            Encuentra hoteles boutique únicos para una escapada inolvidable.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition-transform hover:scale-105"
          >
            Buscar hoteles
          </Link>
        </div>
      </section>

      {/* ¿Por qué StayAdvisor? */}
      <section className="bg-[#0f172a] py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center !text-white mb-12">¿Por qué StayAdvisor?</h2>
        <div className="max-w-6xl mx-auto px-6 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <FaMapMarkedAlt className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">Ubicaciones exclusivas</h3>
            <p className="text-gray-600 text-sm">Explora alojamientos boutique en los rincones más inspiradores.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <FaBolt className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">Reservas en minutos</h3>
            <p className="text-gray-600 text-sm">Plataforma rápida y segura. Gestiona tu escapada sin complicaciones.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <FaStar className="text-pink-500 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl text-gray-800 mb-2">Experiencias únicas</h3>
            <p className="text-gray-600 text-sm">Cada hotel ha sido elegido por su carácter, diseño y servicio personalizado.</p>
          </div>
        </div>
      </section>

      {/* Carrusel de Hoteles desde API */}
      <HotelCarrusel />

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    
          {/* Branding */}
          <div>
            <h3 className="text-xl font-bold mb-2 !text-white">StayAdvisor</h3>
            <p className="text-sm text-gray-300">
              Tu guía premium para encontrar hoteles boutique. Vive experiencias únicas con solo unos clics.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold mb-2 !text-white">Navegación</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li><a href="/" className="hover:underline">Página principal</a></li>
              <li><a href="/search" className="hover:underline">Hoteles</a></li>
              <li><a href="/#beneficios" className="hover:underline">Beneficios</a></li>
              <li><a href="/#destacados" className="hover:underline">Destacados</a></li>
            </ul>
          </div>

          {/* Sobre Nosotros */}
          <div>
            <h4 className="font-semibold mb-2 !text-white">Sobre nosotros</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li><a href="/nosotros" className="hover:underline">Quiénes somos</a></li>
              <li><a href="/nosotros" className="hover:underline">Nuestro equipo</a></li>
              <li><a href="/contacto" className="hover:underline">Contacto</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-2 !text-white">Legal</h4>
            <ul className="text-sm space-y-1 text-gray-300">
              <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
              <li><a href="#" className="hover:underline">Política de privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} StayAdvisor — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
