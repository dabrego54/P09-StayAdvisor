import mongoose, { Schema, model, models } from 'mongoose';

const HotelSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: false },
  totalRatings: { type: Number, required: false },
  placeId: { type: String, required: false },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  photoReference: { type: String, required: false },
  services: { type: [String], default: [] },
  price: { type: Number, required: false },

  // Calificación interna combinada
  combinedRating: { type: Number, default: null },

  // Fechas ocupadas (para STAY-97)
  bookedDates: { type: [Date], default: [] },
});

const Hotel = models.Hotel || model('Hotel', HotelSchema);
export default Hotel;
