import mongoose, { Schema, Document } from 'mongoose';

export interface Reserva extends Document {
  hotel: {
    name: string;
    address: string;
    placeId: string;
    price?: number;
    photoReference?: string;
  };
  user: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaInicio: string;
  fechaFin: string;
  createdAt: Date;
}

const ReservaSchema = new Schema<Reserva>({
  hotel: {
    name: String,
    address: String,
    placeId: String,
    price: Number,
    photoReference: String,
  },
  user: {
    nombre: String,
    email: String,
    telefono: String,
  },
  fechaInicio: String,
  fechaFin: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reserva || mongoose.model<Reserva>('Reserva', ReservaSchema);