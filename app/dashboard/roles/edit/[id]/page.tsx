// app/dashboard/roles/edit/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchRoleById } from "@/app/helpers/apiroles";
import EditForm from "@/app/dashboard/roles/edit/EditForm";

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let role = null;
  try {
    role = await fetchRoleById(resolvedParams.id); // No pasamos token
  } catch (error: any) {
    console.error("Error al obtener el rol:", error.message);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">
          Error al cargar el rol: {error.message}. Por favor, intenta de nuevo.
        </p>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Rol No Encontrado</h1>
        <p className="text-gray-500">Rol no encontrado para el ID: {resolvedParams.id}.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Rol</h1>
      <EditForm role={role} /> {/* No pasamos token */}
    </div>
  );
}