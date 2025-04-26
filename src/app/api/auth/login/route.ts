import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'El usuario no existe.' },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Contraseña incorrecta.' },
        { status: 400 }
      );
    }

    // tokens

    return NextResponse.json(
      { message: 'Login exitoso.', user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor.' },
      { status: 500 }
    );
  }
}
