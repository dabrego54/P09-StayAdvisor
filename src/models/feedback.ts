import mongoose, { Schema, models } from 'mongoose';

const feedbackSchema = new Schema({
  hotelPlaceId: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

feedbackSchema.index({ hotelPlaceId: 1, userId: 1 }, { unique: true });

export default models.Feedback || mongoose.model('Feedback', feedbackSchema);
