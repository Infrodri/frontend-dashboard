// app/dashboard/fichas-medicas/add-section/AddAntecedentesPersonalesForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addAntecedentesPersonales } from "@/app/helpers/apifichasmedicas";
import { AntecedentesPersonales } from "@/app/types/FichasMedicasTypes";

interface AddAntecedentesPersonalesFormProps {
  fichaId: string;
  pacienteId: string;
  existingData?: AntecedentesPersonales;
  token: string;
}

export default function AddAntecedentesPersonalesForm({
  fichaId,
  pacienteId,
  existingData,
  token,
}: AddAntecedentesPersonalesFormProps) {
  // Convertir arrays a strings para los textarea (unidos por comas)
  const [enfermedades, setEnfermedades] = useState(
    existingData?.enfermedades?.join(", ") || ""
  );
  const [alergias, setAlergias] = useState(
    existingData?.alergias?.join(", ") || ""
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convertir strings de los textarea a arrays (separados por comas)
    const enfermedadesArray = enfermedades
      ? enfermedades.split(",").map((item) => item.trim()).filter(Boolean)
      : [];
    const alergiasArray = alergias
      ? alergias.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    try {
      await addAntecedentesPersonales(
        pacienteId,
        { enfermedades: enfermedadesArray, alergias: alergiasArray },
        token
      );
      toast.success("Antecedentes personales guardados con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar antecedentes personales");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="enfermedades" className="block text-sm font-medium">
          Enfermedades
        </label>
        <textarea
          id="enfermedades"
          value={enfermedades}
          onChange={(e) => setEnfermedades(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Hipertensión, Diabetes"
          aria-label="Enfermedades del paciente"
        />
      </div>
      <div>
        <label htmlFor="alergias" className="block text-sm font-medium">
          Alergias
        </label>
        <textarea
          id="alergias"
          value={alergias}
          onChange={(e) => setAlergias(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Penicilina, Polen"
          aria-label="Alergias del paciente"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar antecedentes personales"
      >
        {loading ? "Guardando..." : "Guardar Antecedentes Personales"}
      </button>
    </form>
  );
}