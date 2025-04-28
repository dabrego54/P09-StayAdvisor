import mongoose, { Schema, model, models } from 'mongoose';

const HotelSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  price: { type: Number, required: true },
  services: { type: [String], required: true },
});

export const HotelModel = models.Hotel || model('Hotel', HotelSchema);
