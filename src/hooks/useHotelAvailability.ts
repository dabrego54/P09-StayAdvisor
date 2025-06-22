// /hooks/useHotelAvailability.ts

import { useEffect, useState } from 'react';

export const useHotelAvailability = (placeId: string, refreshTrigger?: any) => {
  const [fechasOcupadas, setFechasOcupadas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchFechas = async () => {
    try {
      const res = await fetch(`/api/admin/disponibilidad?placeId=${placeId}`);
      const data = await res.json();
      setFechasOcupadas(data.fechasOcupadas || {});
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId) fetchFechas();
  }, [placeId, refreshTrigger]); // <- se recarga si cambia

  return { fechasOcupadas, loading };
};
