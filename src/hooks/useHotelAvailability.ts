'use client';

import { useEffect, useState } from 'react';

export function useHotelAvailability(placeId: string) {
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
        const data = await res.json();
        if (data.success) setBookedDates(data.bookedDates);
      } catch (err) {
        console.error('Error cargando disponibilidad:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [placeId]);

  return { bookedDates, loading };
}
