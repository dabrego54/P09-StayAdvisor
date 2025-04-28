import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define qué rutas quieres proteger
const protectedPaths = ['/search', '/reserva', '/confirmacion'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo actuar si es una ruta protegida
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // No hay token, redirigir a login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Si hay token, permitimos el acceso (sin verificar el JWT en el Edge)
    return NextResponse.next();
  }

  // Si no es ruta protegida, continuar normal
  return NextResponse.next();
}

// Configuración para que Next.js sepa usar este middleware
export const config = {
  matcher: [
    '/search/:path*',
    '/reserva/:path*',
    '/confirmacion/:path*',
  ],
};
