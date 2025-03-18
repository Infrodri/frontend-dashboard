// app/dashboard/medicos/[id]/active-status/page.tsx
import { fetchMedicoById } from "@/app/helpers/apimedicos";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import EditActiveStatusForm from "@/app/dashboard/medicos/[id]/edit/EditActiveStatusForm";

interface EditActiveStatusPageProps {
  params: Promise<{ id: string }>;
}

const EditActiveStatusPage = async ({ params }: EditActiveStatusPageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const session = await auth();
  if (!session?.user?.token) {
    throw new Error("No autenticado");
  }

  let medico;
  try {
    medico = await fetchMedicoById(id);
  } catch (error) {
    console.error("Error loading medico data:", error);
    notFound();
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Editar Estado del Médico
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <EditActiveStatusForm medico={medico} token={session.user.token} />
      </div>
    </main>
  );
};

export default EditActiveStatusPage;