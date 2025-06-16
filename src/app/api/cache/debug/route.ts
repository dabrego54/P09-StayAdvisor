import { NextRequest, NextResponse } from 'next/server';
import {
  invalidateHotelCache,
  // @ts-ignore (esto es válido si hotelCache no está exportado públicamente)
  __rawCache as hotelCache,
} from '@/utils/cacheHotelSearch';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const invalidateId = params.get('invalidate');

  if (invalidateId) {
    invalidateHotelCache(invalidateId);
    return NextResponse.json({
      message: `Caché invalidado para: ${invalidateId}`,
    });
  }

  const rawData = [...hotelCache.entries()].map(([key, val]) => ({
    query: key,
    expiresInSec: Math.floor((val.expiresAt - Date.now()) / 1000),
    results: Array.isArray(val.data) ? val.data.length : 'unknown',
  }));

  return NextResponse.json({
    cacheEntries: rawData,
    total: rawData.length,
  });
}
