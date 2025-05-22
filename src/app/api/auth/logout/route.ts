import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production';

  const serialized = serialize('token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', serialized);

  return response;
}
