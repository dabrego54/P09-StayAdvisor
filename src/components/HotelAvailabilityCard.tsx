'use client';

import CustomCalendar from './Calendar';
import { useHotelAvailability } from '@/hooks/useHotelAvailability';

type Props = {
  placeId: string;
};

const HotelAvailabilityCard = ({ placeId }: Props) => {
  const { fechasOcupadas, loading } = useHotelAvailability(placeId);

  if (loading) return <p className="text-muted text-center">Cargando disponibilidad...</p>;

  return (
    <div className="p-4 bg-white/10 backdrop-blur rounded-xl shadow-md w-full max-w-md mx-auto">
      <CustomCalendar fechasOcupadas={fechasOcupadas} />
    </div>
  );
};

export default HotelAvailabilityCard;
