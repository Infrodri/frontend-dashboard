// app/dashboard/medicos/[id]/edit/page.tsx
import EditMedicoForm from "@/app/dashboard/medicos/[id]/edit/EditMedicoForm";
import { fetchMedicoById } from "@/app/helpers/api";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";

interface EditMedicoPageProps {
  params: { id: string };
}

const EditMedicoPage = async ({ params }: EditMedicoPageProps) => {
  let medico;
  try {
    const response = await fetchMedicoById(params.id);
    medico = response.medico;
  } catch (error) {
    notFound();
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Editar Médico
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <EditMedicoForm medico={medico} />
      </div>
    </main>
  );
};

export default EditMedicoPage;