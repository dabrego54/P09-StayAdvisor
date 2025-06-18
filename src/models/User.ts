import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    role: {
      type: String,
      enum: ['usuario', 'hotelero', 'admin'],
      default: 'usuario'
    },
  },
  {
    timestamps: true,
  }
);

// Evita recompilar el modelo si ya existe
const User = models.User || model('User', UserSchema);

export default User;
