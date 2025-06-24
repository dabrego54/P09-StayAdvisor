export type Hotel = {
  id: string;
  name: string;
  location: string;
  experience: string;
  price: number;
  services: string[];
};

export interface HotelReal {
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  placeId: string;
  vicinity?: string;
  location: {
    lat: number;
    lng: number;
  };
  photoReference: string | null;

  combinedRating?: number;

  // 🔹 Nuevos campos opcionales
  internalRatingAvg?: number;
  internalRatingCount?: number;
}
