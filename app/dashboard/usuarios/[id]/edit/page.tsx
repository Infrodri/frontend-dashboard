// app/dashboard/medicos/[id]/page.tsx
import { fetchMedicoById } from "@/app/helpers/apimedicos";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import EditMedicoForm from "./EditForm";
import { auth } from "@/auth";

interface EditMedicoPageProps {
  params: { id: string };
}

const EditMedicoPage = async ({ params }: EditMedicoPageProps) => {
  const session = await auth();
  const token = session?.user?.token;

  if (!token) {
    throw new Error("No autenticado");
  }

  let medico;
  try {
    medico = await fetchMedicoById(params.id);
  } catch (error) {
    console.error("Error loading medico data:", error);
    notFound();
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Editar la tabla Médico
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <EditMedicoForm medico={medico} token={token} />
      </div>
    </main>
  );
};

export default EditMedicoPage;