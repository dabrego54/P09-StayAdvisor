// /app/search/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import ExperienceSelector from '@/components/ExperienceSelector';
import ServiceFilter from '@/components/ServiceFilter';
import { filterHotels } from '@/utils/filterHotels';
import HotelCard from '@/components/HotelCard';
import type { Hotel } from '@/types/Hotel';
import type { HotelReal } from '@/types/HotelReal';
import Link from 'next/link';
import Header from '@/components/header';
import fetchRealHotels from '@/utils/fetchRealHotels';

export default function SearchPage() {
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hotels, setHotels] = useState<HotelReal[]>([]);
  const [experienceOptions, setExperienceOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByRating, setSortByRating] = useState(false);

  const [suggestions, setSuggestions] = useState<{ description: string; placeId: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col">
      <Header />

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

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white w-full border rounded-md mt-1 shadow-md max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <li
                  key={s.placeId}
                  onClick={() => handleSuggestionClick(s.description)}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700"
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSidebarToggle}
          className="mt-4 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition text-sm sm:text-base"
        >
          Filtros
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-6">Cargando hoteles...</p>
      )}

      <div className="flex-1 mt-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sortedHotels.length > 0 ? (
            sortedHotels.map((hotel, idx) => (
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
  );
}
