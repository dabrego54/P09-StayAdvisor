// /src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;
const secret = new TextEncoder().encode(process.env.JWT_SECRET); // asegúrate que esté definido

const protectedPaths = ['/search', '/reserva', '/confirmacion'];
const dashboardPath = '/dashboard';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir archivos públicos y estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // 🔐 Validación general para rutas protegidas (sin decodificar token)
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 🔐 Validación específica para /dashboard (requiere rol)
  if (pathname.startsWith(dashboardPath)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role;

      if (role === 'hotelero' || role === 'admin') {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (err) {
      console.error('Invalid JWT in middleware:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next(); // Para otras rutas no protegidas
}
