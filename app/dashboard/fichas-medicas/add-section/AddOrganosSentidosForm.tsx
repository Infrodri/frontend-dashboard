// app/dashboard/fichas-medicas/add-section/AddOrganosSentidosForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addOrganosSentidos } from "@/app/helpers/apifichasmedicas";
import { OrganosSentidos } from "@/app/types/FichasMedicasTypes";

interface AddOrganosSentidosFormProps {
  fichaId: string;
  pacienteId: string;
  existingData?: OrganosSentidos;
  token: string;
}

export default function AddOrganosSentidosForm({
  fichaId,
  pacienteId,
  existingData,
  token,
}: AddOrganosSentidosFormProps) {
  const [vision, setVision] = useState(existingData?.vision || "");
  const [audicion, setAudicion] = useState(existingData?.audicion || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const data = {
    vision: vision || undefined,
    audicion: audicion || undefined,
  };

  try {
    await addOrganosSentidos(pacienteId, data, token);
    toast.success("Órganos de los sentidos guardados con éxito");
    router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
    router.refresh();
  } catch (error: any) {
    toast.error(error.message || "Error al guardar órganos de los sentidos");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vision" className="block text-sm font-medium">
          Visión
        </label>
        <textarea
          id="vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Normal, Miopía"
          aria-label="Visión del paciente"
        />
      </div>
      <div>
        <label htmlFor="audicion" className="block text-sm font-medium">
          Audición
        </label>
        <textarea
          id="audicion"
          value={audicion}
          onChange={(e) => setAudicion(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Normal, Hipoacusia"
          aria-label="Audición del paciente"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar órganos de los sentidos"
      >
        {loading ? "Guardando..." : "Guardar Órganos de los Sentidos"}
      </button>
    </form>
  );
}