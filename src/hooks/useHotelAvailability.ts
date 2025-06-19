'use client';

import { useEffect, useState } from 'react';

export const useHotelAvailability = (placeId: string) => {
  const [fechasOcupadas, setFechasOcupadas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
        const data = await res.json();
        if (data.success) {
          setFechasOcupadas(data.fechasOcupadas || {});
        }
      } catch (error) {
        console.error('Error al obtener fechas ocupadas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId]);

  return { fechasOcupadas, loading };
};
