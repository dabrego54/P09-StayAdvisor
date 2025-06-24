import { useState } from 'react';

type HotelFiltersProps = {
  locationFilter: string;
  onLocationChange: (value: string) => void;
  starFilter: number;
  onStarChange: (value: number) => void;
  availableLocations: string[];
};

export default function HotelFilters({
  locationFilter,
  onLocationChange,
  starFilter,
  onStarChange,
  availableLocations,
}: HotelFiltersProps) {
  const [localInput, setLocalInput] = useState(locationFilter);
  const starOptions = [1, 2, 3, 4, 5];

  const filteredSuggestions = availableLocations.filter((loc) =>
    loc.toLowerCase().includes(localInput.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-lg w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Combobox Localidad */}
        <div className="flex flex-col w-full relative">
          <label className="text-sm text-gray-600 font-semibold mb-1">Localidad</label>
          <input
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              onLocationChange(e.target.value);
            }}
            placeholder="Ej: Santiago, Viña del Mar..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {localInput && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-md w-full z-50 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setLocalInput(suggestion);
                    onLocationChange(suggestion);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-800"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filtro de estrellas */}
        <div className="flex flex-col w-full">
          <label className="text-sm text-gray-600 font-semibold mb-1">Estrellas mínimas</label>
          <div className="flex items-center gap-2 flex-wrap">
            {starOptions.map((star) => (
              <button
                key={star}
                onClick={() => onStarChange(star)}
                className={`flex items-center px-2 py-1 border rounded-full ${
                  starFilter === star
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
              >
                {star} ★
              </button>
            ))}
            <button
              onClick={() => onStarChange(0)}
              className="text-sm text-gray-500 hover:text-red-600 transition ml-2"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
