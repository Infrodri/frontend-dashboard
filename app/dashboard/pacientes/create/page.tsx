// app/dashboard/pacientes/create/page.tsx
import { auth } from "@/auth";
import CreateForm from "./CreateForm";

export default async function CreatePage() {
  const session = await auth();
  if (!session?.user?.token) {
    return <div>No autenticado</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Paciente</h1>
      <CreateForm session={session} />
    </div>
  );
}