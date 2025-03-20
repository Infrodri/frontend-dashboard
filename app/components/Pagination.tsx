"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PaginationProps {
  totalPages: number;
  basePath: string; // Nueva prop para la URL base
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, basePath }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("query") || "";

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString()); // Preservar todos los parámetros actuales
    params.set("page", page.toString()); // Actualizar el parámetro page

    // Construir la URL con la basePath proporcionada
    const url = `${basePath}?${params.toString()}`;
    console.log(`URL generada para página ${page}:`, url); // Log para depurar
    return url;
  };

  return (
    <div className="flex space-x-2">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Anterior
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Siguiente
        </Link>
      )}
    </div>
  );
};

export default Pagination;