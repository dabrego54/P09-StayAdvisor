'use client';

import Header from '@/components/header';
import HotelAvailabilityCard from '@/components/HotelAvailabilityCard';

export default function DashboardPage() {
  const mockHotel = {
    name: 'Hotel Boutique Andes',
    placeId: 'ChIJW8rpeWLLYpYRLrsX9D-Olf0', // reemplaza con uno real
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <HotelAvailabilityCard
          hotelName={mockHotel.name}
          hotelPlaceId={mockHotel.placeId}
        />
      </main>
    </>
  );
}
