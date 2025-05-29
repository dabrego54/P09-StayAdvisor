import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';


const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

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
        { message: 'Contraseña o correo inválido.' },
        { status: 400 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Contraseña o correo inválido.' },
        { status: 400 }
      );
    }


    // Crear token JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    });

    // Retornar datos básicos para guardar en localStorage
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login exitoso.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', serialized);

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error en el servidor.' },
      { status: 500 }
    );
  }
}
