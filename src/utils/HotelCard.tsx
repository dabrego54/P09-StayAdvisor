interface HotelCardProps {
  name: string;
  price: number;
  location: string;
  experience: string;
}

export default function HotelCard({ name, price, location, experience }: HotelCardProps) {
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-blue-800 mb-2">{name}</h3>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Ubicación:</span> {location}
      </p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Experiencia:</span> {experience}
      </p>
      <p className="text-gray-800 font-semibold mb-4">
        <span className="text-blue-600">$</span> {price} por noche
      </p>
      <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
        Ver precios
      </button>
    </div>
  );
}