import { Suspense } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { bebas } from "@/app/ui/fonts";
import PacientesTable from "@/app/components/PacientesTable";
import { fetchPacientes } from "@/app/helpers/apipacientes"; // Asegúrate de que esta función exista
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface PacientesPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

const PacientesPage = async ({ searchParams }: PacientesPageProps) => {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    console.log("No autenticado, redirigiendo a /login");
    redirect("/login");
  }

  const { query = "", page = "1" } = await searchParams;
  const currentPage = Number(page) || 1;
  const ITEMS_PER_PAGE = 5;

  let pacientes = [];
  let pagination = { totalPages: 1, currentPage: 1, totalItems: 0 };
  let errorMessage: string | null = null;

  try {
    const response = await fetchPacientes(currentPage, ITEMS_PER_PAGE, query);
    pacientes = response.pacientes;
    pagination = response.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 };
    console.log("Pacientes recibidos en PacientesPage:", JSON.stringify(pacientes, null, 2));
    console.log("Paginación recibida en PacientesPage:", JSON.stringify(pagination, null, 2));
  } catch (error) {
    console.error("Error al cargar pacientes:", error);
    errorMessage = "No se pudieron cargar los pacientes. Por favor, intenta de nuevo más tarde.";
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
          Pacientes
        </h1>
        <Link
          href="/dashboard/pacientes/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear Paciente
        </Link>
      </div>
      <div className="mb-6">
        <SearchBar placeholder="Buscar pacientes..." />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        {errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : (
          <Suspense fallback={<div className="text-gray-500">Cargando pacientes...</div>}>
            {pacientes.length > 0 ? (
              <PacientesTable pacientes={pacientes} token={token || ""} />
            ) : (
              <p className="text-gray-500 text-center">No se encontraron pacientes.</p>
            )}
          </Suspense>
        )}
      </div>
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={pagination.totalPages} basePath="/dashboard/pacientes" />
        </div>
      )}
    </main>
  );
};

export default PacientesPage;