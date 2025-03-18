// app/dashboard/medicos/page.tsx
import { fetchFilteredMedicos } from "@/app/helpers/api";
import { Suspense } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { bebas } from "@/app/ui/fonts";
import MedicosTable from "@/app/components/MedicosTable";

interface MedicosPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

const MedicosPage = async ({ searchParams }: MedicosPageProps) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const ITEMS_PER_PAGE = 5; // Número de médicos por página

  // Obtener todos los médicos
  const response = await fetchFilteredMedicos();
  let medicos = response.medicos;

  // Filtrar médicos según el query (búsqueda del lado del cliente)
  if (query) {
    const lowerQuery = query.toLowerCase();
    medicos = medicos.filter((medico) =>
      `${medico.primerNombre} ${medico.primerApellido}`.toLowerCase().includes(lowerQuery) ||
      medico.especialidades.some((esp) => esp.nombre.toLowerCase().includes(lowerQuery))
    );
  }

  // Calcular paginación del lado del cliente
  const totalItems = medicos.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMedicos = medicos.slice(startIndex, endIndex);

  return (
    <main className="p-4 md:p-6 lg:p-8">
      {/* Título */}
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Médicos
      </h1>

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <SearchBar placeholder="Buscar médicos..." />
      </div>

      {/* Tabla de médicos */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Suspense fallback={<div className="text-gray-500">Cargando médicos...</div>}>
          <MedicosTable medicos={paginatedMedicos} />
        </Suspense>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
};

export default MedicosPage;