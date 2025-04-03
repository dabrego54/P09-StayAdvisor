// src/components/ServiceFilter.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ServiceFilterProps {
  selectedServices: string[];
  onChange: (service: string) => void;
  options: string[];
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ selectedServices, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-left text-gray-700 font-medium hover:bg-gray-100 transition"
      >
        {selectedServices.length > 0 ? `Servicios (${selectedServices.length})` : 'Selecciona servicios'}
        <span className="float-right">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto p-4">
          {options.map(service => (
            <label key={service} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => onChange(service)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-800">{service}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceFilter;