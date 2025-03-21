// app/dashboard/fichas-medicas/edit/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchFichaMedicaById, fetchPacientes } from "@/app/helpers/apifichasmedicas";
import EditForm from "@/app/dashboard/fichas-medicas/edit/EditForm";

interface EditFichaMedicaPageProps {
  params: { id: string };
}

export default async function EditFichaMedicaPage({ params }: EditFichaMedicaPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Añadir verificación para session.user.token
  if (!session.user.token) {
    redirect("/login");
  }

  let ficha = null;
  let pacientes = [];
  try {
    // Reemplazar session.accessToken por session.user.token
    ficha = await fetchFichaMedicaById(params.id, session.user.token);
    pacientes = await fetchPacientes(session.user.token);
  } catch (error: any) {
    console.error("Error al obtener datos:", error.message);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">
          Error al cargar la ficha médica: {error.message}. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Ficha No Encontrada</h1>
        <p className="text-gray-500">Ficha médica no encontrada para el ID: {params.id}.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Ficha Médica</h1>
      <EditForm ficha={ficha} pacientes={pacientes} token={session.user.token} />
    </div>
  );
}