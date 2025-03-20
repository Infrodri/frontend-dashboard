// app/dashboard/pacientes/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error en el módulo de pacientes:", error);
  }, [error]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
      <p className="mb-4">Ocurrió un error al cargar la página de pacientes: {error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}