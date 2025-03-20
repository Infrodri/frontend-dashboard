// app/dashboard/pacientes/[id]/edit/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">No se encontró el paciente solicitado</h1>
      <p className="mb-4">El paciente que intentas editar no existe o ha sido eliminado.</p>
      <Link href="/dashboard/pacientes" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Volver a la lista de pacientes
      </Link>
    </div>
  );
}