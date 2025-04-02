interface Hotel {
  id: number;
  name: string;
  location: string;
  experience: string;
}

/**
 * Filters hotels based on search text and location.
 * @param hotels - Array of hotel objects.
 * @param searchText - Text to filter by name or experience.
 * @param location - Location to filter by.
 * @returns Filtered array of hotels.
 */
export function filterHotels_Location(
  hotels: Hotel[],
  searchText: string,
  location: string
): Hotel[] {
  return hotels.filter((hotel) => {
    const matchesSearchText =
      hotel.name.toLowerCase().includes(searchText.toLowerCase()) ||
      hotel.experience.toLowerCase().includes(searchText.toLowerCase());
    const matchesLocation =
      location === '' || hotel.location.toLowerCase() === location.toLowerCase();

    return matchesSearchText && matchesLocation;
  });
}