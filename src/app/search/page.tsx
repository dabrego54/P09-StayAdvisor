'use client';

import { useState, useEffect } from 'react';
import Spinner from './Spinner'; // Import the Spinner component
import { filterHotelsByPrice } from '@/utils/filterHotelsByPrice';
import { filterHotels_Location } from '@/utils/filterHotelsByLocation';

const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Hotel Magnolia",
    location: "Santiago",
    experience: "Lujo clásico",
    price: 150,
  },
  {
    id: 2,
    name: "Casa Andina Premium",
    location: "Cusco",
    experience: "Auténtico andino",
    price: 200,
  },
  {
    id: 3,
    name: "Palacio Astoreca",
    location: "Valparaíso",
    experience: "Boutique frente al mar",
    price: 180,
  },
];

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]); // State for price range
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(mockHotels);

  useEffect(() => {
    // Simulate initial loading with setTimeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  // Apply filters whenever searchText, selectedLocation, or priceRange changes
  useEffect(() => {
    const timer = setTimeout(() => {
      let hotels = filterHotels_Location(mockHotels, searchText, selectedLocation);
      hotels = filterHotelsByPrice(hotels, priceRange[0], priceRange[1]); // Apply price range filter
      setFilteredHotels(hotels);
      setIsLoading(false); // Hide spinner
    }, 500); // Simulate a short delay for filtering

    return () => clearTimeout(timer); // Cleanup timeout
  }, [priceRange, searchText, selectedLocation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value, 10);
    setPriceRange((prevRange) => {
      const newRange = [...prevRange];
      newRange[index] = value;
      return newRange as [number, number];
    });
  };

  const handlePriceRangeMouseUp = () => {
    setIsLoading(true); // Show spinner
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <Spinner />; // Show spinner while loading
  }

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white p-6 border-r border-gray-200 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-50`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filtros</h2>

        {/* Location Filter */}
        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">
            Filtrar por ubicación
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Todas las ubicaciones</option>
            <option value="Santiago">Santiago</option>
            <option value="Cusco">Cusco</option>
            <option value="Valparaíso">Valparaíso</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Filtrar por rango de precio (USD)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="300"
              value={priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e, 0)}
              onMouseUp={handlePriceRangeMouseUp} // Trigger spinner after releasing the mouse
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="300"
              value={priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e, 1)}
              onMouseUp={handlePriceRangeMouseUp} // Trigger spinner after releasing the mouse
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 bg-white text-black border border-gray-400 p-3 rounded-full shadow-lg z-40 focus:outline-none hover:bg-gray-100 transition"
      >
        ☰
      </button>

      {/* Main Content */}
      <section className="flex-1 p-8">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔍 Buscar Hoteles Boutique
          </h1>

          {/* Search Input */}
          <form className="mb-6">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Ej: Casa Andina, Lujo clásico..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </form>

          {/* Filtered Results */}
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Resultados simulados
            </h2>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition"
                >
                  <h3 className="text-lg font-bold text-blue-800">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">
                    {hotel.location} — {hotel.experience} — ${hotel.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No se encontraron resultados</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

