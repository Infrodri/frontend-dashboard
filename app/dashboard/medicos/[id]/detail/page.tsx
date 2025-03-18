// app/dashboard/medicos/[id]/detail/page.tsx
import { fetchMedicoById } from "@/app/helpers/apimedicos";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import DetailMedico from "./DetailMedico";
import { auth } from "@/auth";

interface DetailMedicoPageProps {
  params: Promise<{ id: string }>; // Cambiamos params a Promise para cumplir con las expectativas de Next.js
}

const DetailMedicoPage = async ({ params }: DetailMedicoPageProps) => {
  const resolvedParams = await params; // Aseguramos que params esté resuelto
  const id = resolvedParams.id; // Ahora podemos usar id de manera segura

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
        Detalles del Médico
      </h1>
      <DetailMedico medico={medico} />
    </main>
  );
};

export default DetailMedicoPage;