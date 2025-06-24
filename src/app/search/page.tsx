// /app/search/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import HotelCard from '@/components/HotelCard';
import type { HotelReal } from '@/types/HotelReal';
import Link from 'next/link';
import Header from '@/components/header';
import fetchRealHotels from '@/utils/fetchRealHotels';
import { Search } from 'lucide-react';
import HotelFilters from '@/components/HotelFilters';

export default function SearchPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hotels, setHotels] = useState<HotelReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByRating, setSortByRating] = useState(false);

  const [suggestions, setSuggestions] = useState<{ description: string; placeId: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [locationFilter, setLocationFilter] = useState('');
  const [starFilter, setStarFilter] = useState(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleSuggestionClick = async (desc: string) => {
    setSearchText(desc);
    setSuggestions([]);
    setShowSuggestions(false);
    setLoading(true);
    const hoteles = await fetchRealHotels(desc);
    setHotels(hoteles);
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const query = searchText.trim().length >= 2 ? `${searchText} hotel` : 'Hotel';
      const hoteles = await fetchRealHotels(query);
      setHotels(hoteles);
      setLoading(false);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      const term = searchText.trim();
      if (term.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch(`/api/autocomplete?input=${term}`, { signal: controller.signal });
        const data = await res.json();

        const mapped = (data.results || []).slice(0, 6).map((hotel: any) => ({
          description: `${hotel.name} - ${hotel.formatted_address}`,
          placeId: hotel.place_id,
        }));

        setSuggestions(mapped);
        setShowSuggestions(true);

        const found = mapped.find((s: { description: string }) => s.description === term);
        if (found) setShowSuggestions(false);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  const sortedHotels = [...hotels].sort((a, b) => {
    if (!sortByRating) return 0;
    const ratingA = a.combinedRating ?? a.rating ?? 0;
    const ratingB = b.combinedRating ?? b.rating ?? 0;
    return ratingB - ratingA;
  });

  const filteredHotels = sortedHotels.filter(hotel => {
    const matchesLocation = locationFilter
      ? (
        hotel.vicinity?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(locationFilter.toLowerCase())
        )
      : true;


    const matchesStars = starFilter > 0
      ? (hotel.rating ?? 0) >= starFilter
      : true;

    return matchesLocation && matchesStars;
  });

  const uniqueLocations = Array.from(
    new Set(hotels.map(h => (h.vicinity ?? h.address).split(',')[0].trim()).filter((val): val is string => typeof val === 'string'))
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col">
      <Header />

      <section className="w-full px-4 sm:px-8 lg:px-12 max-w-[1000px] mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Buscar Hoteles Boutique</h1>

        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full shadow-md px-4 py-2 relative focus-within:ring-2 focus-within:ring-blue-300 transition-all duration-200">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Busca hoteles boutique"
            className="flex-1 border-none outline-none text-sm sm:text-base text-gray-800 placeholder-gray-500 px-2 bg-transparent"
          />
          <button
            onClick={handleSidebarToggle}
            className="bg-blue-600 text-white text-sm font-semibold rounded-full px-4 py-2 hover:bg-blue-700 transition"
          >
            Filtros
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-[999] max-h-72 overflow-y-auto animate-fade-in">
              {suggestions.map((s) => (
                <li
                  key={s.placeId}
                  onClick={() => handleSuggestionClick(s.description)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700 transition"
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isSidebarOpen && (
          <div className="mt-4">
            <HotelFilters
              locationFilter={locationFilter}
              onLocationChange={setLocationFilter}
              starFilter={starFilter}
              onStarChange={setStarFilter}
              availableLocations={uniqueLocations}
            />
          </div>
        )}
      </section>

      {loading && (
        <p className="text-center text-gray-500 mt-6">Cargando hoteles...</p>
      )}

      <div className="flex-1 mt-8 px-4 sm:px-8 lg:px-12 w-full">
        <div className="w-full max-w-[1600px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6">Resultados</h2>

          <div className="flex justify-end mb-4">
            <button
              className={`px-4 py-2 rounded font-semibold border transition ${
                sortByRating
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-600 border-blue-600'
              }`}
              onClick={() => setSortByRating((v) => !v)}
            >
              {sortByRating ? 'Ordenar por defecto' : 'Ordenar por mejor calificación'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, idx) => (
                <HotelCard
                  key={hotel.placeId}
                  hotel={hotel}
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
                  ranking={sortByRating ? idx + 1 : undefined}
                />
              ))
            ) : (
              <p className="text-gray-500">No se encontraron resultados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
