export type Hotel = {
  id: string;
  name: string;
  location: string;
  experience: string;
  price: number;
  services: string[];
};

export type HotelReal = {
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  placeId: string;
  location: {
    lat: number;
    lng: number;
  };
  photoReference: string | null;
};
