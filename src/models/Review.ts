import mongoose, { Schema, Document } from 'mongoose';

export interface ReviewDocument extends Document {
  userId: string;
  hotelPlaceId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    userId: { type: String, required: true },
    hotelPlaceId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

// Evitar redefinición en hot reload (desarrollo)
export default mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);
