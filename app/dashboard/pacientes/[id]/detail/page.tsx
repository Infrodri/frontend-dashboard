// app/dashboard/pacientes/[id]/detail/page.tsx
import { auth } from "@/auth";
import Detail from "./Detail";
import { fetchPacienteById } from "@/app/helpers/apipacientes";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
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

  return <Detail paciente={paciente} />;
}