interface Hotel {
  id: number;
  name: string;
  location: string;
  experience: string;
  price: number;
}

/**
 * Filters hotels based on a price range.
 * @param hotels - Array of hotel objects.
 * @param minPrice - Minimum price to filter by.
 * @param maxPrice - Maximum price to filter by.
 * @returns Filtered array of hotels.
 */
export function filterHotelsByPrice(hotels: Hotel[], minPrice: number, maxPrice: number): Hotel[] {
  return hotels.filter((hotel) => hotel.price >= minPrice && hotel.price <= maxPrice);
}