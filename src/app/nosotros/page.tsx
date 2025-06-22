'use client';

import Header from '@/components/header';
import EquipoCardList from '@/components/EquipoCardList';

export default function SobreNosotros() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />

      {/* Hero Intro */}
      <section className="bg-gradient-to-b from-[#9dbcf5] via-white to-white py-20 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0f172a] mb-4">Sobre Nosotros</h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          En StayAdvisor nos dedicamos a conectar personas con experiencias auténticas en los hoteles boutique más encantadores de Chile.
        </p>
      </section>

      {/* Contenido Principal */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid gap-12 text-gray-800">
        {/* Quiénes somos */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0f172a] mb-3">¿Quiénes somos?</h2>
          <p className="text-base leading-relaxed">
            Somos un equipo de apasionados por los viajes, la hospitalidad y la tecnología. Creemos que alojarse en lugares únicos puede transformar por completo una experiencia, y por eso creamos StayAdvisor: una plataforma que reúne solo hoteles boutique cuidadosamente seleccionados.
          </p>
        </div>

        <EquipoCardList />

        {/* Misión */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0f172a] mb-3">Nuestra misión</h2>
          <p className="text-base leading-relaxed">
            Queremos facilitar que viajeros locales y extranjeros descubran lo mejor del turismo chileno, apoyando además a pequeños y medianos hoteleros que entregan un servicio de excelencia.
          </p>
        </div>

        {/* Por qué confiar */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0f172a] mb-3">¿Por qué confiar en nosotros?</h2>
          <ul className="list-disc pl-5 text-base leading-relaxed space-y-2">
            <li>Hoteles verificados y seleccionados por su calidad, diseño y ubicación.</li>
            <li>Reseñas reales y sistema de calificación confiable.</li>
            <li>Interfaz rápida, segura y fácil de usar.</li>
            <li>Comprometidos con la sostenibilidad y el turismo responsable.</li>
          </ul>
        </div>
      </section>

      {/* Footer simple opcional */}
      <footer className="bg-white border-t mt-20 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} StayAdvisor — Conectando experiencias únicas.
      </footer>
    </div>
  );
}
