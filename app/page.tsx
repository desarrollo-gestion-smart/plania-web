import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Plania
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Tu plataforma integral de gestión de negocios
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
        >
          Ir al Login
        </Link>
      </div>
    </div>
  );
}
