import mongoose, { Schema, models } from 'mongoose';

const disponibilidadManualSchema = new Schema({
  placeId: { type: String, required: true, unique: true },
  fechas: [String],
});

export default models.DisponibilidadManual || mongoose.model('DisponibilidadManual', disponibilidadManualSchema);
