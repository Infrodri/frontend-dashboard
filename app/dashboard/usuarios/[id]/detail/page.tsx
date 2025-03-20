import { fetchUserById } from "@/app/helpers/apiusers";
import { bebas } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import Detail from "./Detail";
import { auth } from "@/auth";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

const DetailPage = async ({ params }: DetailPageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const session = await auth();
  if (!session?.user?.token) {
    throw new Error("No autenticado");
  }

  let user;
  try {
    user = await fetchUserById(id);
  } catch (error) {
    console.error("Error loading user data:", error);
    notFound();
  }

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Detalles del Usuario
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <Detail user={user} />
      </div>
    </main>
  );
};

export default DetailPage;