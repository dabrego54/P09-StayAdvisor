'use client';

interface MiembroEquipo {
  nombre: string;
  cargo: string;
  carrera: string;
  imagen: string;
}

const integrantes: MiembroEquipo[] = [
  {
    nombre: 'Daniel Abrego Tobar',
    cargo: 'Co-Fundador & Full Stack Developer',
    carrera: 'Ing. Civil Informática',
    imagen: '/equipo/daniel.jpg',
  },
  {
    nombre: 'Fernando Rojas Larraín',
    cargo: 'Co-Fundador & Full Stack Developer',
    carrera: 'Ing. Civil Industrial & Informática',
    imagen: '/equipo/fernando.jpg',
  },
];

export default function EquipoCardList() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-[#0f172a] mb-12">Nuestro equipo</h2>
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-10">
        {integrantes.map((miembro, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition w-72"
          >
            <img
              src={miembro.imagen}
              alt={miembro.nombre}
              className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-blue-200"
            />
            <h3 className="text-xl font-semibold text-[#0f172a]">{miembro.nombre}</h3>
            <p className="text-sm text-gray-600 italic mb-1">{miembro.carrera}</p>
            <p className="text-sm text-blue-700 font-medium">{miembro.cargo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
