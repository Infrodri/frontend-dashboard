// app/dashboard/pacientes/[id]/edit/page.tsx
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { fetchPacienteById } from "@/app/helpers/apipacientes";
import EditForm from "./EditForm";
import EditActiveStatusForm from "./EditActiveStatusForm";
import { bebas } from "@/app/ui/fonts";

interface EditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function EditPage({ params, searchParams }: EditPageProps) {
  const session = await auth();
  if (!session?.user?.token) {
    return notFound();
  }

  const { id } = await params;
  const { type = "info" } = await searchParams; // Por defecto, cargamos el formulario de datos ("info")

  let paciente;
  try {
    paciente = await fetchPacienteById(id);
    console.log("Paciente obtenido en EditPage:", paciente); // Depuración
  } catch (error) {
    console.error("Error fetching paciente:", error);
    return notFound();
  }

  if (!paciente) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        {type === "status" ? "Editar Estado del Paciente" : "Editar Paciente"}
      </h1>
      {type === "status" ? (
        <EditActiveStatusForm paciente={paciente} token={session.user.token} />
      ) : (
        <EditForm paciente={paciente} token={session.user.token} />
      )}
    </div>
  );
}