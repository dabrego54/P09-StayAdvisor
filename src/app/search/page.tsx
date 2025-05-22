'use client';

import { useState, useEffect } from 'react';
import ExperienceSelector from '@/components/ExperienceSelector';
import ServiceFilter from '@/components/ServiceFilter';
import { filterHotels } from '@/utils/filterHotels';
import HotelCard from '@/components/HotelCard';
import type { Hotel } from '@/types/Hotel';
import Link from 'next/link';
import Header from '@/components/header';

export default function SearchPage() {
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // 🔵 Agregado para manejar carga

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
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/hotels');
        const data = await res.json();

        if (data.success) {
          const loadedHotels = data.hotels as Hotel[];
          setHotels(loadedHotels);

          const uniqueExperiences = Array.from(
            new Set(loadedHotels.map(h => h.experience))
          );
          setExperienceOptions(uniqueExperiences);
        } else {
          console.error('Error al cargar hoteles desde API');
        }
      } catch (error) {
        console.error('Error de conexión a la API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = filterHotels(hotels, {
    experience: selectedExperience,
    services: selectedServices,
    searchText: searchText
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando hoteles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />

      {/* Barra de búsqueda */}
      <div className="w-full px-4 sm:px-6 max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 m-auto mt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Buscar Hoteles Boutique
        </h1>

        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Busca hoteles boutique: Casa Andina, Magnolia..."
            className="w-full pl-10 p-3 sm:p-4 border border-gray-300 rounded-lg shadow-sm text-gray-800 placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <button
          onClick={handleSidebarToggle}
          className="mt-4 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Filtros
        </button>
      </div>

      {/* Sidebar de filtros */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full overflow-y-auto bg-white p-6 sm:p-8 shadow-xl transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 1000 }}
      >
        <button onClick={handleSidebarToggle} className="text-black text-2xl absolute top-4 right-4">
          ✕
        </button>
        <h2 className="text-black text-2xl font-bold mb-6">Filtros</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Tipo de experiencia</h3>
            <ExperienceSelector
              selected={selectedExperience}
              onSelect={handleExperienceSelect}
              options={experienceOptions}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Servicios</h3>
            <ServiceFilter
              selectedServices={selectedServices}
              onChange={handleServiceToggle}
              options={['Wifi', 'Desayuno', 'Piscina', 'Spa']}
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="flex-1 mt-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">Resultados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))
          ) : (
            <p className="text-gray-500">No se encontraron resultados</p>
          )}

        </div>
      </div>
    </div>
  );
}
