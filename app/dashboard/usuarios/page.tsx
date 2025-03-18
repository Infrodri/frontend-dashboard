// app/dashboard/medicos/page.tsx
import { Suspense } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { bebas } from "@/app/ui/fonts";
import MedicosTable from "@/app/components/MedicosTable";
import { fetchFilteredMedicos } from "@/app/helpers/apimedicos";
import Link from "next/link";

interface MedicosPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const MedicosPage = async ({ searchParams }: MedicosPageProps) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 5;

  // Obtener médicos paginados y filtrados
  const { medicos, pagination } = await fetchFilteredMedicos(currentPage, ITEMS_PER_PAGE, query);

  return (
    <main className="p-4 md:p-6 lg:p-8">
      {/* Título y botón para crear médico */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}
        >
          Médicos
        </h1>
        <Link
          href="/dashboard/medicos/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear Médico
        </Link>
      </div>

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <SearchBar placeholder="Buscar médicos..." />
      </div>

      {/* Tabla de médicos */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Suspense fallback={<div className="text-gray-500">Cargando médicos...</div>}>
          {medicos.length > 0 ? (
            <MedicosTable medicos={medicos} />
          ) : (
            <p className="text-gray-500 text-center">No se encontraron médicos.</p>
          )}
        </Suspense>
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={pagination.totalPages} />
        </div>
      )}
    </main>
  );
};

export default MedicosPage;