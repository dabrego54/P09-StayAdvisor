import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const serialized = serialize('token', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production', 
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', serialized);

  return response;
}
