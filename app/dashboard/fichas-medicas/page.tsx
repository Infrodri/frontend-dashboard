// app/dashboard/fichas-medicas/page.tsx
import { Suspense } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { bebas } from "@/app/ui/fonts";
import Link from "next/link";
import { fetchFichasMedicas } from "@/app/helpers/apifichasmedicas";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface FichasMedicasPageProps {
  searchParams: Promise<{ query?: string; page?: string; estado?: string }>;
}

const FichasMedicasPage = async ({ searchParams }: FichasMedicasPageProps) => {
  const { query = "", page = "1", estado } = await searchParams;
  const currentPage = Number(page) || 1;
  const ITEMS_PER_PAGE = 2;

  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const token = session?.user?.token;
  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fichas Médicas</h1>
        <p className="text-red-500">
          Error: No se encontró un token de autenticación. Por favor, inicia sesión nuevamente.
        </p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const { fichas, total, page: fetchedPage, limit, totalPages } = await fetchFichasMedicas(
    currentPage,
    ITEMS_PER_PAGE,
    estado
  );

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
          Fichas Médicas
        </h1>
        <Link
          href="/dashboard/fichas-medicas/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear Ficha Médica
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Buscar fichas médicas..." />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Suspense fallback={<div className="text-gray-500">Cargando fichas médicas...</div>}>
          {fichas.length > 0 ? (
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Paciente</th>
                  <th className="py-2 px-4 border-b">Cédula</th>
                  <th className="py-2 px-4 border-b">Estado</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fichas.map((ficha) => (
                  <tr key={ficha._id}>
                    <td className="py-2 px-4 border-b">
                      {typeof ficha.paciente === "object" && ficha.paciente
                        ? `${ficha.paciente.primerNombre} ${ficha.paciente.primerApellido}`
                        : "Paciente no disponible"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {typeof ficha.paciente === "object" && ficha.paciente ? ficha.paciente.cedula : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">{ficha.estado}</td>
                    <td className="py-2 px-4 border-b">
                      <Link
                        href={`/dashboard/fichas-medicas/details/${ficha._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No se encontraron fichas médicas.</p>
          )}
        </Suspense>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={totalPages} basePath="/dashboard/fichas-medicas" />
        </div>
      )}
    </main>
  );
};

export default FichasMedicasPage;