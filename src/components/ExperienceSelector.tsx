'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ExperienceSelectorProps {
  selected: string;
  onSelect: (experience: string) => void;
  options: string[];
}

const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({ selected, onSelect, options }) => {
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

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-left text-gray-700 font-medium hover:bg-gray-100 transition text-sm sm:text-base flex justify-between items-center"
        aria-expanded={isOpen}
        aria-controls="experience-options"
      >
        <span>{selected || 'Selecciona una experiencia'}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
      </button>

      <ul
        id="experience-options"
        className={`absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {options.map((option) => (
          <li
            key={option}
            onClick={() => handleSelect(option)}
            className={`px-4 py-3 sm:py-2 cursor-pointer hover:bg-blue-100 ${
              selected === option ? 'bg-blue-500 text-white' : 'text-gray-800'
            } text-sm sm:text-base`}
            role="option"
            aria-selected={selected === option}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceSelector;
