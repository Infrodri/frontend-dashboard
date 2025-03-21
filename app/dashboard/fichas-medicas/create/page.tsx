// app/dashboard/fichas-medicas/create/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { bebas } from "@/app/ui/fonts";
import { Session } from "next-auth";
import CreateForm from "@/app/dashboard/fichas-medicas/create/CreateForm";

export default async function CreateFichaMedicaPage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) redirect("/login");

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <h1 className={`${bebas.className} text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6`}>
        Crear Ficha Médica
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <CreateForm session={session} />
      </div>
    </main>
  );
}