import mongoose, { Schema, Document } from 'mongoose';

export interface Reserva extends Document {
  hotel: any; // Acepta objetos tipo HotelReal u Hotel
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
    type: Schema.Types.Mixed, // <-- permite guardar cualquier estructura de hotel
    required: true
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
