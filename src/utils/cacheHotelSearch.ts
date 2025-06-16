// src/utils/cacheHotelSearch.ts

type CacheValue = { data: any; expiresAt: number };

const hotelCache = new Map<string, CacheValue>();

export function getCachedHotels(query: string): any | null {
  const cached = hotelCache.get(query);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`⚡ HIT cache: ${query}`);
    return cached.data;
  }
  if (cached) {
    console.log(`🧹 Expirada cache: ${query}`);
    hotelCache.delete(query);
  }
  console.log(`⛔ MISS cache: ${query}`);
  return null;
}

export function setCachedHotels(query: string, data: any, ttlMs: number) {
  hotelCache.set(query, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidateHotelCache(hotelPlaceId: string) {
  let count = 0;
  for (const [key, val] of hotelCache.entries()) {
    if (JSON.stringify(val.data).includes(hotelPlaceId)) {
      hotelCache.delete(key);
      count++;
    }
  }
  console.log(`♻️ Cache invalidada para hotel ${hotelPlaceId} en ${count} consultas.`);
}

export const __rawCache = hotelCache;
