// app/dashboard/medicos/[id]/page.tsx
import Detail from "@/app/dashboard/medicos/[id]/detail/Detail";
import { fetchMedicoById } from "@/app/helpers/apimedicos";

interface MedicoDetailPageProps {
  params: { id: string };
}

const MedicoDetailPage = async ({ params }: MedicoDetailPageProps) => {
  const medico = await fetchMedicoById(params.id);
  return <Detail medico={medico} />;
};

export default MedicoDetailPage;