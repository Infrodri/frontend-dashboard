// app/dashboard/fichas-medicas/add-section/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { fetchFichaMedicaById } from "@/app/helpers/apifichasmedicas";
import AddOrganosSentidosForm from "@/app/dashboard/fichas-medicas/add-section/AddOrganosSentidosForm";
import AddExamenNeurologicoForm from "@/app/dashboard/fichas-medicas/add-section/AddExamenNeurologicoForm";
import AddExploracionFisicaForm from "@/app/dashboard/fichas-medicas/add-section/AddExploracionFisicaForm";
import AddAntecedentesFamiliaresForm from "@/app/dashboard/fichas-medicas/add-section/AddAntecedentesFamiliaresForm";
import AddConsultaMedicaForm from "@/app/dashboard/fichas-medicas/add-section/AddConsultaMedicaForm";
import AddGinecologiaObstetricaForm from "@/app/dashboard/fichas-medicas/add-section/AddGinecologiaObstetricaForm";
import AddAdiccionForm from "@/app/dashboard/fichas-medicas/add-section/AddAdiccionForm";
import AddOperacionQuirurgicaForm from "@/app/dashboard/fichas-medicas/add-section/AddOperacionQuirurgicaForm";
import AddAntecedentesPersonalesForm from "@/app/dashboard/fichas-medicas/add-section/AddAntecedentesPersonalesForm";
import { FichaMedica, Paciente, AntecedentesPersonales, AntecedentesFamiliares, ExploracionFisica, ExamenNeurologico, OrganosSentidos } from "@/app/types/FichasMedicasTypes";

interface AddSectionPageProps {
  params: { id: string };
  searchParams: Promise<{ section?: string }>;
}

export default async function AddSectionPage({ params, searchParams }: AddSectionPageProps) {
  const session = await auth();
  if (!session?.user?.token) {
    redirect("/login");
  }

  const { section } = await searchParams;
  if (!section) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">Sección no especificada en los parámetros de búsqueda.</p>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>
    );
  }

  let ficha: FichaMedica | null = null;
  try {
    ficha = await fetchFichaMedicaById(params.id, session.user.token);
  } catch (error: any) {
    console.error("Error al obtener la ficha médica:", error.message);
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">
          Error al cargar la ficha médica: {error.message}. Por favor, intenta de nuevo.
        </p>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ficha No Encontrada</h1>
        <p className="text-gray-500">Ficha médica no encontrada para el ID: {params.id}.</p>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>
    );
  }

  const paciente: Paciente = typeof ficha.paciente === "string"
    ? { _id: ficha.paciente, primerNombre: "Desconocido", primerApellido: "", cedula: "N/A", edad: 0 }
    : ficha.paciente;

  // Convertir null a undefined para existingData
  const antecedentesPersonales: AntecedentesPersonales | undefined = ficha.antecedentesPersonales ?? undefined;
  const antecedentesFamiliares: AntecedentesFamiliares | undefined = ficha.antecedentesFamiliares ?? undefined;
  const exploracionFisica: ExploracionFisica | undefined = ficha.exploracionFisica ?? undefined;
  const examenNeurologico: ExamenNeurologico | undefined = ficha.examenNeurologico ?? undefined;
  const organosSentidos: OrganosSentidos | undefined = ficha.organosSentidos ?? undefined;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {section.includes("antecedentes-personales")
            ? "Añadir/Editar Antecedentes Personales"
            : section.includes("operaciones-quirurgicas")
            ? "Añadir Operación Quirúrgica"
            : section.includes("antecedentes-familiares")
            ? "Añadir/Editar Antecedentes Familiares"
            : section.includes("consultas-medicas")
            ? "Añadir Consulta Médica"
            : section.includes("ginecologia-obstetrica")
            ? "Añadir Registro de Ginecología y Obstetricia"
            : section.includes("adicciones")
            ? "Añadir Adicción"
            : section.includes("exploracion-fisica")
            ? "Añadir/Editar Exploración Física"
            : section.includes("examen-neurologico")
            ? "Añadir/Editar Examen Neurológico"
            : section.includes("organos-sentidos")
            ? "Añadir/Editar Órganos de los Sentidos"
            : "Añadir/Editar Sección"}
        </h1>
        <Link
          href={`/dashboard/fichas-medicas/details/${params.id}`}
          className="text-blue-500 hover:underline"
          aria-label="Volver a los detalles de la ficha médica"
        >
          Volver a Detalles
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <p>
          <strong>Paciente:</strong> {paciente.primerNombre} {paciente.primerApellido}
        </p>
        <p>
          <strong>Cédula:</strong> {paciente.cedula || "No especificado"}
        </p>
      </div>

      {section === "antecedentes-personales" && (
        <AddAntecedentesPersonalesForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          existingData={antecedentesPersonales}
          token={session.user.token}
        />
      )}
      {section === "operaciones-quirurgicas" && (
        <AddOperacionQuirurgicaForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          token={session.user.token}
        />
      )}
      {section === "antecedentes-familiares" && (
        <AddAntecedentesFamiliaresForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          existingData={antecedentesFamiliares}
          token={session.user.token}
        />
      )}
      {section === "consultas-medicas" && (
        <AddConsultaMedicaForm
          fichaId={ficha._id}
          token={session.user.token}
        />
      )}
      {section === "ginecologia-obstetrica" && (
        <AddGinecologiaObstetricaForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          token={session.user.token}
        />
      )}
      {section === "adicciones" && (
        <AddAdiccionForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          token={session.user.token}
        />
      )}
      {section === "exploracion-fisica" && (
        <AddExploracionFisicaForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          existingData={exploracionFisica}
          token={session.user.token}
        />
      )}
      {section === "examen-neurologico" && (
        <AddExamenNeurologicoForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          existingData={examenNeurologico}
          token={session.user.token}
        />
      )}
      {section === "organos-sentidos" && (
        <AddOrganosSentidosForm
          fichaId={ficha._id}
          pacienteId={typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id}
          existingData={organosSentidos}
          token={session.user.token}
        />
      )}
      {![
        "antecedentes-personales",
        "operaciones-quirurgicas",
        "antecedentes-familiares",
        "consultas-medicas",
        "ginecologia-obstetrica",
        "adicciones",
        "exploracion-fisica",
        "examen-neurologico",
        "organos-sentidos",
      ].includes(section) && (
        <div className="text-red-500">Sección no soportada actualmente: {section}.</div>
      )}
    </div>
  );
}