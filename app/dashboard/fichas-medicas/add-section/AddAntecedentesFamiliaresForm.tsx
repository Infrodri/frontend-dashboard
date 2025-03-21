// app/dashboard/fichas-medicas/add-section/AddAntecedentesFamiliaresForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addAntecedentesFamiliares } from "@/app/helpers/apifichasmedicas";
import { AntecedentesFamiliares } from "@/app/types/FichasMedicasTypes";

interface AddAntecedentesFamiliaresFormProps {
  fichaId: string;
  pacienteId: string;
  existingData?: AntecedentesFamiliares;
  token: string;
}

export default function AddAntecedentesFamiliaresForm({
  fichaId,
  pacienteId,
  existingData,
  token,
}: AddAntecedentesFamiliaresFormProps) {
  const [enfermedades, setEnfermedades] = useState(
    existingData?.enfermedades?.join(", ") || ""
  );
  const [parentesco, setParentesco] = useState(existingData?.parentesco || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const enfermedadesArray = enfermedades
      ? enfermedades.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    try {
      await addAntecedentesFamiliares(
        pacienteId,
        { enfermedades: enfermedadesArray, parentesco },
        token
      );
      toast.success("Antecedentes familiares guardados con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar antecedentes familiares");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="enfermedades" className="block text-sm font-medium">
          Enfermedades Hereditarias
        </label>
        <textarea
          id="enfermedades"
          value={enfermedades}
          onChange={(e) => setEnfermedades(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Diabetes, Hipertensión"
          aria-label="Enfermedades hereditarias"
        />
      </div>
      <div>
        <label htmlFor="parentesco" className="block text-sm font-medium">
          Parentesco
        </label>
        <input
          type="text"
          id="parentesco"
          value={parentesco}
          onChange={(e) => setParentesco(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Padre, Madre"
          aria-label="Parentesco"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar antecedentes familiares"
      >
        {loading ? "Guardando..." : "Guardar Antecedentes Familiares"}
      </button>
    </form>
  );
}