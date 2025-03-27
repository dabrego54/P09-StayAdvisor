export default function SearchPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🔍 Buscar Hoteles Boutique
          </h1>
          <form>
            <input
              type="text"
              placeholder="Ej: Casa Andina, Hotel Magnolia..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </form>
        </div>
      </main>
    );
  }
  