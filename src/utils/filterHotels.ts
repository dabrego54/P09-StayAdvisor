// src/utils/filterHotels.ts

export interface Hotel {
    id: number;
    name: string;
    location: string;
    experience: string;
    services: string[];
  }
  
  interface FilterCriteria {
    experience?: string;
    services?: string[];
    searchText?: string;
  }
  
  export function filterHotels(hotels: Hotel[], filters: FilterCriteria): Hotel[] {
    return hotels.filter(hotel => {
      const matchExperience = filters.experience
        ? hotel.experience === filters.experience
        : true;
  
      const matchServices = filters.services && filters.services.length > 0
        ? filters.services.every(s => hotel.services.includes(s))
        : true;
  
      const matchSearch = filters.searchText
        ? [hotel.name, hotel.location, hotel.experience]
            .some(field => field.toLowerCase().includes(filters.searchText!.toLowerCase()))
        : true;
  
      return matchExperience && matchServices && matchSearch;
    });
  }
  