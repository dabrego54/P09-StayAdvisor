import mongoose, { Schema, models } from 'mongoose';

const ratingSchema = new Schema({
  hotelPlaceId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId, // Este es el _id que viene de tu modelo de usuario
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  opiniones: {
    comodidades: {
      type: String,
      default: '',
    },
    comida: {
      type: String,
      default: '',
    },
    servicio: {
      type: String,
      default: '',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Impide múltiples ratings del mismo usuario para el mismo hotel
ratingSchema.index({ hotelPlaceId: 1, userId: 1 }, { unique: true });

export default models.RatingInterno || mongoose.model('RatingInterno', ratingSchema);
