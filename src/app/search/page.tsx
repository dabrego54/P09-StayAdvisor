'use client'

import { useState } from 'react';
import ExperienceSelector from '@/components/ExperiencieSelector';
import ServiceFilter from '@/components/ServiceFilter';
import { filterHotels } from '@/utils/filterHotels';



// Datos simulados de hoteles
const mockHotels = [
  {
    id: 1,
    name: "Hotel Magnolia",
    location: "Santiago",
    experience: "Lujo clásico",
    services: ["Wifi", "Desayuno"]
  },
  {
    id: 2,
    name: "Casa Andina Premium",
    location: "Cusco",
    experience: "Auténtico andino",
    services: ["Wifi", "Piscina", "Spa"]
  },
  {
    id: 3,
    name: "Palacio Astoreca",
    location: "Valparaíso",
    experience: "Boutique frente al mar",
    services: ["Desayuno", "Piscina"]
  }
];


const experienceOptions = ['Lujo clásico', 'Auténtico andino', 'Boutique frente al mar'];

export default function SearchPage() {
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);


  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleResetFilters = () => {
    setSelectedExperience('');
    setSelectedServices([]);
  };
  

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };
  
  
  const filteredHotels = filterHotels(mockHotels, {
    experience: selectedExperience,
    services: selectedServices,
    searchText: searchText
  });  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Barra de búsqueda */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 m-auto mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🔍 Buscar Hoteles Boutique
        </h1>

        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Ej: Casa Andina, Hotel Magnolia..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          onClick={handleSidebarToggle}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Filtros
        </button>
      </div>

      {/* Sidebar de filtros */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-1/3 h-full bg-white p-6 shadow-xl transform transition-all ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 1000 }}
      >
        <button onClick={handleSidebarToggle} className="text-black text-2xl absolute top-4 right-4">
          ✕
        </button>
        <h2 className="text-black text-xl font-semibold mb-4">Filtros</h2>

        <div className="space-y-4">
          <h3 className="font-medium text-black mb-2">Tipo de experiencia</h3>
          <ExperienceSelector
            selected={selectedExperience}
            onSelect={handleExperienceSelect}
            options={experienceOptions}
          />

          <h3 className="font-medium text-black mt-6 mb-2">Servicios</h3>
          <ServiceFilter
            selectedServices={selectedServices}
            onChange={handleServiceToggle}
            options={['Wifi', 'Desayuno', 'Piscina', 'Spa']}
          />

          <button
            onClick={handleResetFilters}
            className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Limpiar filtros
          </button>

        </div>
      </div>

      {/* Resultados */}
      <div className="mt-8 space-y-4 px-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700">Resultados</h2>
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition">
              <h3 className="text-lg font-bold text-blue-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.location} — {hotel.experience}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
}
