interface Hotel {
  id: number;
  name: string;
  location: string;
  experience: string;
  price: number;
}

/**
 * Filters hotels based on a maximum price.
 * @param hotels - Array of hotel objects.
 * @param maxPrice - Maximum price to filter by.
 * @returns Filtered array of hotels.
 */
export function filterHotelsByPrice(hotels: Hotel[], maxPrice: number): Hotel[] {
  return hotels.filter((hotel) => hotel.price <= maxPrice);
}