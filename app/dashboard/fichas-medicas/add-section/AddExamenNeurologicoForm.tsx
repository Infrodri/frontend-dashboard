// app/dashboard/fichas-medicas/add-section/AddExamenNeurologicoForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addExamenNeurologico } from "@/app/helpers/apifichasmedicas";
import { ExamenNeurologico } from "@/app/types/FichasMedicasTypes";

interface AddExamenNeurologicoFormProps {
  fichaId: string;
  pacienteId: string;
  existingData?: ExamenNeurologico;
  token: string;
}

export default function AddExamenNeurologicoForm({
  fichaId,
  pacienteId,
  existingData,
  token,
}: AddExamenNeurologicoFormProps) {
  const [reflejos, setReflejos] = useState(existingData?.reflejos || "");
  const [coordinacion, setCoordinacion] = useState(existingData?.coordinacion || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      reflejos: reflejos || undefined,
      coordinacion: coordinacion || undefined,
    };

    try {
      await addExamenNeurologico(pacienteId, data, token);
      toast.success("Examen neurológico guardado con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar examen neurológico");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reflejos" className="block text-sm font-medium">
          Reflejos
        </label>
        <textarea
          id="reflejos"
          value={reflejos}
          onChange={(e) => setReflejos(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Normales, Disminuidos"
          aria-label="Reflejos del paciente"
        />
      </div>
      <div>
        <label htmlFor="coordinacion" className="block text-sm font-medium">
          Coordinación
        </label>
        <textarea
          id="coordinacion"
          value={coordinacion}
          onChange={(e) => setCoordinacion(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Normal, Alterada"
          aria-label="Coordinación del paciente"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar examen neurológico"
      >
        {loading ? "Guardando..." : "Guardar Examen Neurológico"}
      </button>
    </form>
  );
}