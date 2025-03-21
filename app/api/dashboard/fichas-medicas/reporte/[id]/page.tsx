// app/dashboard/fichas-medicas/reporte/[id]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import {
  FichaMedica,
  Paciente,
  AntecedentesPersonales,
  AntecedentesFamiliares,
  OperacionQuirurgica,
  GinecologiaObstetrica,
  Adiccion,
  ExploracionFisica,
  ExamenNeurologico,
  OrganosSentidos,
  ConsultaMedica,
} from "@/app/types/FichasMedicasTypes";
import { fetchFichaMedicaByPacienteId } from "@/app/helpers/apifichasmedicas";

interface ReporteFichaMedicaPageProps {
  params: { id: string };
}

export default async function ReporteFichaMedicaPage({ params }: ReporteFichaMedicaPageProps) {
  const session = await auth();
  if (!session?.user?.token) {
    redirect("/login");
  }

  let ficha: FichaMedica | null = null;
  try {
    // Usamos fetchFichaMedicaByPacienteId, que espera el ID del paciente
    ficha = await fetchFichaMedicaByPacienteId(params.id, session.user.token);
  } catch (error: any) {
    console.error("Error al generar el reporte:", error.message);
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">Error al generar el reporte: {error.message}. Por favor, intenta de nuevo.</p>
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
        <p className="text-gray-500">Ficha médica no encontrada para el paciente con ID: {params.id}.</p>
        <Link href="/dashboard/fichas-medicas" className="text-blue-500 hover:underline">
          Volver a la lista de fichas
        </Link>
      </div>
    );
  }

  const paciente = typeof ficha.paciente === "string" ? { primerNombre: "Desconocido", primerApellido: "", cedula: "N/A", edad: 0 } : ficha.paciente;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reporte de Ficha Médica</h1>
        <Link
          href={`/dashboard/fichas-medicas/details/${ficha._id}`}
          className="text-blue-500 hover:underline"
          aria-label="Volver a los detalles de la ficha médica"
        >
          Volver a Detalles
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Encabezado del Reporte */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">
            Ficha Médica de {paciente.primerNombre} {paciente.primerApellido}
          </h2>
          <p className="text-gray-600">
            Generado el: {new Date().toLocaleDateString()} a las{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Información General */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Información General</h3>
          <p>
            <strong>Nombre:</strong> {paciente.primerNombre} {paciente.primerApellido}
          </p>
          <p>
            <strong>Cédula:</strong> {paciente.cedula || "No especificado"}
          </p>
          <p>
            <strong>Edad:</strong> {paciente.edad || "No especificado"} años
          </p>
          <p>
            <strong>Estado:</strong> {ficha.estado}
          </p>
          <p>
            <strong>Fecha de Creación:</strong>{" "}
            {ficha.createdAt ? new Date(ficha.createdAt).toLocaleDateString() : "No especificado"}
          </p>
          <p>
            <strong>Última Actualización:</strong>{" "}
            {ficha.updatedAt ? new Date(ficha.updatedAt).toLocaleDateString() : "No especificado"}
          </p>
        </section>

        {/* Antecedentes Personales */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Antecedentes Personales</h3>
          {ficha.antecedentesPersonales ? (
            <ul className="list-disc pl-5">
              <li>
                <strong>Enfermedades:</strong>{" "}
                {ficha.antecedentesPersonales.enfermedades?.join(", ") || "No especificado"}
              </li>
              <li>
                <strong>Alergias:</strong>{" "}
                {ficha.antecedentesPersonales.alergias?.join(", ") || "No especificado"}
              </li>
            </ul>
          ) : (
            <p>No hay antecedentes personales registrados.</p>
          )}
        </section>

        {/* Antecedentes Familiares */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Antecedentes Familiares</h3>
          {ficha.antecedentesFamiliares ? (
            <ul className="list-disc pl-5">
              <li>
                <strong>Enfermedades:</strong>{" "}
                {ficha.antecedentesFamiliares.enfermedades?.join(", ") || "No especificado"}
              </li>
              <li>
                <strong>Parentesco:</strong>{" "}
                {ficha.antecedentesFamiliares.parentesco || "No especificado"}
              </li>
            </ul>
          ) : (
            <p>No hay antecedentes familiares registrados.</p>
          )}
        </section>

        {/* Operaciones Quirúrgicas */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Operaciones Quirúrgicas</h3>
          {ficha.operacionesQuirurgicas && ficha.operacionesQuirurgicas.length > 0 ? (
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Tipo de Operación</th>
                  <th className="border p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ficha.operacionesQuirurgicas.map((op, index) => (
                  <tr key={index}>
                    <td className="border p-2">{op.tipoOperacionQuirurgica || "No especificado"}</td>
                    <td className="border p-2">
                      {op.fecha ? new Date(op.fecha).toLocaleDateString() : "No especificado"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay operaciones quirúrgicas registradas.</p>
          )}
        </section>

        {/* Ginecología y Obstetricia */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ginecología y Obstetricia</h3>
          {ficha.ginecologiaObstetrica && ficha.ginecologiaObstetrica.length > 0 ? (
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Tipo</th>
                  <th className="border p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ficha.ginecologiaObstetrica.map((gyn, index) => (
                  <tr key={index}>
                    <td className="border p-2">{gyn.tipoObstetricoGinecologico || "No especificado"}</td>
                    <td className="border p-2">
                      {gyn.fecha ? new Date(gyn.fecha).toLocaleDateString() : "No especificado"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos de ginecología y obstetricia registrados.</p>
          )}
        </section>

        {/* Adicciones */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Adicciones</h3>
          {ficha.adicciones && ficha.adicciones.length > 0 ? (
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Tipo de Adicción</th>
                  <th className="border p-2">Frecuencia</th>
                </tr>
              </thead>
              <tbody>
                {ficha.adicciones.map((adiccion, index) => (
                  <tr key={index}>
                    <td className="border p-2">{adiccion.tipoAdiccion || "No especificado"}</td>
                    <td className="border p-2">{adiccion.frecuencia || "No especificado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay adicciones registradas.</p>
          )}
        </section>

        {/* Exploración Física */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Exploración Física</h3>
          {ficha.exploracionFisica ? (
            <ul className="list-disc pl-5">
              <li>
                <strong>Peso:</strong> {ficha.exploracionFisica.peso || "No especificado"} kg
              </li>
              <li>
                <strong>Altura:</strong> {ficha.exploracionFisica.altura || "No especificado"} cm
              </li>
              <li>
                <strong>Presión Arterial:</strong>{" "}
                {ficha.exploracionFisica.presionArterial || "No especificado"}
              </li>
            </ul>
          ) : (
            <p>No hay exploración física registrada.</p>
          )}
        </section>

        {/* Examen Neurológico */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Examen Neurológico</h3>
          {ficha.examenNeurologico ? (
            <ul className="list-disc pl-5">
              <li>
                <strong>Reflejos:</strong>{" "}
                {ficha.examenNeurologico.reflejos || "No especificado"}
              </li>
              <li>
                <strong>Coordinación:</strong>{" "}
                {ficha.examenNeurologico.coordinacion || "No especificado"}
              </li>
            </ul>
          ) : (
            <p>No hay examen neurológico registrado.</p>
          )}
        </section>

        {/* Órganos de los Sentidos */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Órganos de los Sentidos</h3>
          {ficha.organosSentidos ? (
            <ul className="list-disc pl-5">
              <li>
                <strong>Visión:</strong> {ficha.organosSentidos.vision || "No especificado"}
              </li>
              <li>
                <strong>Audición:</strong> {ficha.organosSentidos.audicion || "No especificado"}
              </li>
            </ul>
          ) : (
            <p>No hay datos de órganos de los sentidos registrados.</p>
          )}
        </section>

        {/* Consultas Médicas */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Consultas Médicas</h3>
          {ficha.consultasMedicas && ficha.consultasMedicas.length > 0 ? (
            <table className="min-w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Motivo</th>
                  <th className="border p-2">Diagnóstico</th>
                </tr>
              </thead>
              <tbody>
                {ficha.consultasMedicas.map((consulta, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      {consulta.fecha
                        ? new Date(consulta.fecha).toLocaleDateString()
                        : "No especificado"}
                    </td>
                    <td className="border p-2">{consulta.motivo || "No especificado"}</td>
                    <td className="border p-2">{consulta.diagnostico || "No especificado"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay consultas médicas registradas.</p>
          )}
        </section>

        {/* Botón para Imprimir */}
        <div className="mt-6">
          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            aria-label="Imprimir reporte"
          >
            Imprimir Reporte
          </button>
        </div>
      </div>
    </div>
  );
}