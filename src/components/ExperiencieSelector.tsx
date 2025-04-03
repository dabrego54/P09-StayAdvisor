// src/components/ExperienceSelector.tsx
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-left text-gray-700 font-medium hover:bg-gray-100 transition"
      >
        {selected || 'Selecciona una experiencia'}
        <span className="float-right">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                selected === option ? 'bg-blue-500 text-white' : 'text-gray-800'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExperienceSelector;
