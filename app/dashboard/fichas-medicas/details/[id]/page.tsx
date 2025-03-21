// app/dashboard/fichas-medicas/details/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import { fetchFichaMedicaById } from "@/app/helpers/apifichasmedicas";
import { FichaMedica, Paciente } from "@/app/types/FichasMedicasTypes";

interface FichaDetailsPageProps {
  params: Promise<{ id: string }>; // Ajustamos el tipo para reflejar que params es un Promise
}

export default async function FichaDetailsPage({ params }: FichaDetailsPageProps) {
  const resolvedParams = await params; // Esperamos params para resolver el Promise
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.token) {
    redirect("/login");
  }

  let ficha: FichaMedica | null = null;
  try {
    console.log("ID de la ficha:", resolvedParams.id); // Usamos resolvedParams.id
    console.log("Token de autenticación:", session.user.token);
    ficha = await fetchFichaMedicaById(resolvedParams.id, session.user.token);
  } catch (error: any) {
    console.error("Error al obtener la ficha médica:", error.message);
    let errorMessage = "Error al cargar la ficha médica. Por favor, intenta de nuevo.";

    // Manejar errores específicos
    if (error.message.includes("404")) {
      errorMessage = "Ficha médica no encontrada para el ID proporcionado.";
    } else if (error.message.includes("401")) {
      errorMessage = "No autorizado. Por favor, inicia sesión nuevamente.";
      redirect("/login");
    }

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{errorMessage}</p>
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
        <p className="text-gray-500">Ficha médica no encontrada para el ID: {resolvedParams.id}.</p>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>
    );
  }

  const paciente: Paciente = typeof ficha.paciente === "string"
    ? { _id: ficha.paciente, primerNombre: "Desconocido", primerApellido: "", cedula: "N/A", edad: 0 }
    : ficha.paciente;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalles de la Ficha Médica</h1>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Información del Paciente</h2>
        <p>
          <strong>Nombre:</strong> {paciente.primerNombre} {paciente.primerApellido}
        </p>
        <p>
          <strong>Cédula:</strong> {paciente.cedula || "No especificado"}
        </p>
        <p>
          <strong>Edad:</strong> {paciente.edad || "No especificado"}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Acciones</h2>
        <div className="space-y-2">
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=antecedentes-personales`}
            className="block text-blue-500 hover:underline"
          >
            Añadir/Editar Antecedentes Personales
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=operaciones-quirurgicas`}
            className="block text-blue-500 hover:underline"
          >
            Añadir Operación Quirúrgica
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=antecedentes-familiares`}
            className="block text-blue-500 hover:underline"
          >
            Añadir/Editar Antecedentes Familiares
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=consultas-medicas`}
            className="block text-blue-500 hover:underline"
          >
            Añadir Consulta Médica
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=ginecologia-obstetrica`}
            className="block text-blue-500 hover:underline"
          >
            Añadir Registro de Ginecología y Obstetricia
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=adicciones`}
            className="block text-blue-500 hover:underline"
          >
            Añadir Adicción
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=exploracion-fisica`}
            className="block text-blue-500 hover:underline"
          >
            Añadir/Editar Exploración Física
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=examen-neurologico`}
            className="block text-blue-500 hover:underline"
          >
            Añadir/Editar Examen Neurológico
          </Link>
          <Link
            href={`/dashboard/fichas-medicas/add-section/${ficha._id}?section=organos-sentidos`}
            className="block text-blue-500 hover:underline"
          >
            Añadir/Editar Órganos de los Sentidos
          </Link>
        </div>
      </div>

      {ficha.antecedentesPersonales && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Antecedentes Personales</h2>
          <p>
            <strong>Enfermedades:</strong>{" "}
            {ficha.antecedentesPersonales.enfermedades?.join(", ") || "No especificado"}
          </p>
          <p>
            <strong>Alergias:</strong>{" "}
            {ficha.antecedentesPersonales.alergias?.join(", ") || "No especificado"}
          </p>
        </div>
      )}

      {ficha.antecedentesFamiliares && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Antecedentes Familiares</h2>
          <p>
            <strong>Enfermedades:</strong>{" "}
            {ficha.antecedentesFamiliares.enfermedades?.join(", ") || "No especificado"}
          </p>
          <p>
            <strong>Parentesco:</strong>{" "}
            {ficha.antecedentesFamiliares.parentesco || "No especificado"}
          </p>
        </div>
      )}

      {ficha.operacionesQuirurgicas && ficha.operacionesQuirurgicas.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Operaciones Quirúrgicas</h2>
          <ul className="list-disc pl-5">
            {ficha.operacionesQuirurgicas.map((op, index) => (
              <li key={index}>
                {op.tipoOperacionQuirurgica} -{" "}
                {op.fecha ? new Date(op.fecha).toLocaleDateString() : "Fecha no especificada"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ficha.consultasMedicas && ficha.consultasMedicas.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Consultas Médicas</h2>
          <ul className="list-disc pl-5">
            {ficha.consultasMedicas.map((consulta, index) => (
              <li key={index}>
                <strong>Motivo:</strong> {consulta.motivo || "No especificado"} -{" "}
                <strong>Diagnóstico:</strong> {consulta.diagnostico || "No especificado"} -{" "}
                <strong>Fecha:</strong>{" "}
                {consulta.fecha ? new Date(consulta.fecha).toLocaleDateString() : "No especificada"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ficha.ginecologiaObstetrica && ficha.ginecologiaObstetrica.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Ginecología y Obstetricia</h2>
          <ul className="list-disc pl-5">
            {ficha.ginecologiaObstetrica.map((registro, index) => (
              <li key={index}>
                {registro.tipoObstetricoGinecologico} -{" "}
                {registro.fecha ? new Date(registro.fecha).toLocaleDateString() : "Fecha no especificada"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ficha.adicciones && ficha.adicciones.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Adicciones</h2>
          <ul className="list-disc pl-5">
            {ficha.adicciones.map((adiccion, index) => (
              <li key={index}>
                {adiccion.tipoAdiccion} -{" "}
                {adiccion.frecuencia || "Frecuencia no especificada"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ficha.exploracionFisica && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Exploración Física</h2>
          <p>
            <strong>Peso:</strong> {ficha.exploracionFisica.peso || "No especificado"} kg
          </p>
          <p>
            <strong>Altura:</strong> {ficha.exploracionFisica.altura || "No especificado"} cm
          </p>
          <p>
            <strong>Presión Arterial:</strong>{" "}
            {ficha.exploracionFisica.presionArterial || "No especificado"}
          </p>
        </div>
      )}

      {ficha.examenNeurologico && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Examen Neurológico</h2>
          <p>
            <strong>Reflejos:</strong> {ficha.examenNeurologico.reflejos || "No especificado"}
          </p>
          <p>
            <strong>Coordinación:</strong>{" "}
            {ficha.examenNeurologico.coordinacion || "No especificado"}
          </p>
        </div>
      )}

      {ficha.organosSentidos && (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Órganos de los Sentidos</h2>
          <p>
            <strong>Visión:</strong> {ficha.organosSentidos.vision || "No especificado"}
          </p>
          <p>
            <strong>Audición:</strong> {ficha.organosSentidos.audicion || "No especificado"}
          </p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">Estado de la Ficha</h2>
        <p>
          <strong>Estado:</strong> {ficha.estado}
        </p>
        <p>
          <strong>Creada:</strong>{" "}
          {ficha.createdAt ? new Date(ficha.createdAt).toLocaleDateString() : "No especificado"}
        </p>
        <p>
          <strong>Actualizada:</strong>{" "}
          {ficha.updatedAt ? new Date(ficha.updatedAt).toLocaleDateString() : "No especificado"}
        </p>
      </div>
    </div>
  );
}