//LANDING PAGE

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">StayAdvisor</h1>
        <p className="text-gray-700 text-lg mb-8">
          Encuentra tu <span className="font-semibold text-blue-600">hotel boutique ideal</span> con experiencias únicas.
        </p>
        <Link href="/search">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
            🔍 Ir al buscador
          </button>
        </Link>
      </div>
    </main>
  );
}
