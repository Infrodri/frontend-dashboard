// app/dashboard/pacientes/[id]/active-status/page.tsx
import { auth } from "@/auth";
import EditActiveStatusForm from "../edit/EditActiveStatusForm";
import { fetchPacienteById } from "@/app/helpers/apipacientes";

interface ActiveStatusPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActiveStatusPage({ params }: ActiveStatusPageProps) {
  const session = await auth();
  if (!session?.user?.token) {
    return <div>No autenticado</div>;
  }

  const { id } = await params;

  let paciente;
  try {
    paciente = await fetchPacienteById(id);
  } catch (error) {
    return <div>No se pudo cargar el paciente.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cambiar Estado del Paciente</h1>
      <EditActiveStatusForm paciente={paciente} token={session.user.token} />
    </div>
  );
}