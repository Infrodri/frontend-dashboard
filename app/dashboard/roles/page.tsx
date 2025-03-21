// app/dashboard/roles/page.tsx
import { Suspense } from "react";
import SearchBar from "@/app/components/SearchBar";
import Pagination from "@/app/components/Pagination";
import { bebas } from "@/app/ui/fonts";
import RolesTable from "./RolesTable";
import { fetchRoles } from "@/app/helpers/apiroles";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@/app/types/RolesTypes";

// Definir el tipo de paginación (debería coincidir con el definido en apiroles.ts)
interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface RolesPageProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

const RolesPage = async ({ searchParams }: RolesPageProps) => {
  const session = await auth();
  if (!session?.user) {
    console.log("No autenticado, redirigiendo a /login");
    redirect("/login");
  }

  const { query = "", page = "1" } = await searchParams;
  const currentPage = Number(page) || 1;
  const ITEMS_PER_PAGE = 5;

  // Definir roles y pagination con tipos explícitos
  let roles: Role[] = [];
  let pagination: Pagination = { totalPages: 1, currentPage: 1, totalItems: 0 };
  let errorMessage: string | null = null;

  try {
    const response = await fetchRoles(currentPage, ITEMS_PER_PAGE, query);
    roles = response.roles;
    pagination = response.pagination || { totalPages: 1, currentPage: 1, totalItems: 0 };
    console.log("Roles recibidos en RolesPage:", JSON.stringify(roles, null, 2));
    console.log("Paginación recibida en RolesPage:", JSON.stringify(pagination, null, 2));
  } catch (error) {
    console.error("Error al cargar roles:", error);
    errorMessage = "No se pudieron cargar los roles. Por favor, intenta de nuevo más tarde.";
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900`}>
          Roles
        </h1>
        <Link
          href="/dashboard/roles/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear Rol
        </Link>
      </div>
      <div className="mb-6">
        <SearchBar placeholder="Buscar roles..." />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        {errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : (
          <Suspense fallback={<div className="text-gray-500">Cargando roles...</div>}>
            {roles.length > 0 ? (
              <RolesTable roles={roles} />
            ) : (
              <p className="text-gray-500 text-center">No se encontraron roles.</p>
            )}
          </Suspense>
        )}
      </div>
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination totalPages={pagination.totalPages} basePath="/dashboard/roles" />
        </div>
      )}
    </main>
  );
};

export default RolesPage;