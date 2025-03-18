// app/dashboard/medicos/[id]/page.tsx
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { fetchMedicoById } from "@/app/helpers/apimedicos";
import DetailMedico from "./detail/DetailMedico";

const MedicoDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await auth();
  if (!session || !session.user) {
    notFound();
  }

  const token = session.user.token;

  let medico;
  try {
    const response = await fetchMedicoById(id, token);
    medico = response.medico;
  } catch (error) {
    console.error("Error fetching medico:", error);
    notFound();
  }

  if (!medico) {
    notFound();
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <DetailMedico medico={medico} />
    </main>
  );
};

export default MedicoDetailsPage;