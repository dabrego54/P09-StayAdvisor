import mongoose, { Schema, Document } from 'mongoose';

export interface ReviewDocument extends Document {
  userId: string;
  hotelPlaceId: string;
  rating: number;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    userId: { type: String, required: true },
    hotelPlaceId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

// Evitar redefinición en hot reload (desarrollo)
export default mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);
