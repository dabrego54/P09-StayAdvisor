import mongoose, { Schema, models } from 'mongoose';

const reservaSchema = new Schema({
  hotelName: String,
  hotelPlaceId: String,
  userEmail: String,
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  checkIn: String,
  checkOut: String,
  guests: Number,
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Reserva || mongoose.model('Reserva', reservaSchema);
