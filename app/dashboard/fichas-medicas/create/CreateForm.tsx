// app/dashboard/fichas-medicas/create/CreateForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createFicha, addAntecedentesPersonales } from "@/app/helpers/apifichasmedicas";
import { Session } from "next-auth";

interface CreateFormProps {
  session: Session | null;
}

interface FormData {
  pacienteId: string;
  enfermedades: string[];
  alergias: string[];
}

const CreateForm: React.FC<CreateFormProps> = ({ session }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    pacienteId: "",
    enfermedades: [],
    alergias: [],
  });
  const [currentEnfermedad, setCurrentEnfermedad] = useState("");
  const [currentAlergia, setCurrentAlergia] = useState("");
  const [fichaId, setFichaId] = useState<string | null>(null);
  const [pacienteIdForAntecedentes, setPacienteIdForAntecedentes] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFicha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user || !session.user.token) {
      setError("No autenticado");
      return;
    }

    if (!formData.pacienteId) {
      setError("Debe ingresar un ID de paciente.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await createFicha(formData.pacienteId, session.user.token);
      setSuccessMessage(response.message || "Ficha médica creada con éxito");
      setFichaId(response.ficha?._id || null);
      setPacienteIdForAntecedentes(response.ficha?.paciente as string);
    } catch (error: any) {
      console.error("Error en handleCreateFicha:", error.message);
      setError(error.message || "No se pudo crear la ficha médica.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAntecedentes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user || !session.user.token) {
      setError("No autenticado");
      return;
    }

    if (!pacienteIdForAntecedentes) {
      setError("Primero crea una ficha médica para añadir antecedentes.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await addAntecedentesPersonales(
        pacienteIdForAntecedentes,
        { enfermedades: formData.enfermedades, alergias: formData.alergias },
        session.user.token
      );
      setSuccessMessage(response.message || "Antecedentes personales añadidos con éxito");
      setTimeout(() => {
        router.push("/dashboard/fichas-medicas");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      console.error("Error en handleAddAntecedentes:", error.message);
      setError(error.message || "No se pudo añadir los antecedentes personales.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEnfermedad = () => {
    if (currentEnfermedad.trim()) {
      setFormData((prev) => ({
        ...prev,
        enfermedades: [...prev.enfermedades, currentEnfermedad.trim()],
      }));
      setCurrentEnfermedad("");
    }
  };

  const addAlergia = () => {
    if (currentAlergia.trim()) {
      setFormData((prev) => ({
        ...prev,
        alergias: [...prev.alergias, currentAlergia.trim()],
      }));
      setCurrentAlergia("");
    }
  };

  return (
    <div>
      {/* Formulario para crear ficha médica */}
      <form onSubmit={handleCreateFicha} className="space-y-6 mb-6">
        <div>
          <label htmlFor="pacienteId" className="block text-sm font-medium text-gray-700">
            ID del Paciente *
          </label>
          <input
            type="text"
            id="pacienteId"
            name="pacienteId"
            value={formData.pacienteId}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: 507f1f77bcf86cd799439011"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && !fichaId && <p className="text-green-500">{successMessage}</p>}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creando..." : "Crear Ficha"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/fichas-medicas")}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Formulario para añadir antecedentes personales */}
      {fichaId && (
        <form onSubmit={handleAddAntecedentes} className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Añadir Antecedentes Personales</h2>
          <div>
            <label htmlFor="enfermedades" className="block text-sm font-medium text-gray-700">
              Enfermedades
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="enfermedades"
                value={currentEnfermedad}
                onChange={(e) => setCurrentEnfermedad(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Hipertensión"
              />
              <button
                type="button"
                onClick={addEnfermedad}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Añadir
              </button>
            </div>
            {formData.enfermedades.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {formData.enfermedades.map((enf, index) => (
                  <li key={index}>{enf}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="alergias" className="block text-sm font-medium text-gray-700">
              Alergias
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="alergias"
                value={currentAlergia}
                onChange={(e) => setCurrentAlergia(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Penicilina"
              />
              <button
                type="button"
                onClick={addAlergia}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Añadir
              </button>
            </div>
            {formData.alergias.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {formData.alergias.map((alergia, index) => (
                  <li key={index}>{alergia}</li>
                ))}
              </ul>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Guardando..." : "Guardar Antecedentes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/fichas-medicas")}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateForm;