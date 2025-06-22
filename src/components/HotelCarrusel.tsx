'use client';

interface HotelLocal {
  name: string;
  location: string;
  image: string;
}

export default function HotelCarrusel() {
  const hoteles: HotelLocal[] = [
    {
      name: 'Hotel Patagonia Azul',
      location: 'Puerto Natales, Chile',
      image: '/hotels/patagonia.jpg',
    },
    {
      name: 'Casa de Mar',
      location: 'Valparaíso, Chile',
      image: '/hotels/valpo.jpg',
    },
    {
      name: 'Montaña Viva',
      location: 'Pucón, Chile',
      image: '/hotels/pucon.jpg',
    },
    {
      name: 'Viña & Relajo',
      location: 'Casablanca, Chile',
      image: '/hotels/vina.jpg',
    },
    {
      name: 'Bosque Encantado',
      location: 'Frutillar, Chile',
      image: '/hotels/bosque.jpg',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
        Destinos destacados
      </h2>
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide">
        {hoteles.map((hotel, i) => (
          <div
            key={i}
            className="min-w-[280px] sm:min-w-[320px] snap-center rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-white hover:shadow-xl transition"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
