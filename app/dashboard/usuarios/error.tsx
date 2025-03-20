"use client"
import { bebas } from "@/app/ui/fonts";

export default function Error() {
  return (
    <div className="p-4 md:p-6 lg:p-8 text-center">
      <h1 className={`${bebas.className} text-2xl font-bold text-gray-900 mb-4`}>
        Error
      </h1>
      <p className="text-gray-600">Ocurrió un error al procesar la solicitud. Por favor, intenta de nuevo más tarde.</p>
      <a href="/dashboard/usuarios" className="mt-4 inline-block text-blue-600 hover:underline">
        Volver a Usuarios
      </a>
    </div>
  );
}