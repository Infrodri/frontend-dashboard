// app/dashboard/fichas-medicas/add-section/AddAdiccionForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addAdiccion } from "@/app/helpers/apifichasmedicas";

interface AddAdiccionFormProps {
  fichaId: string;
  pacienteId: string;
  token: string;
}

export default function AddAdiccionForm({
  fichaId,
  pacienteId,
  token,
}: AddAdiccionFormProps) {
  const [tipoAdiccion, setTipoAdiccion] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAdiccion(pacienteId, { tipoAdiccion, frecuencia }, token);
      toast.success("Adicción guardada con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar adicción");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tipoAdiccion" className="block text-sm font-medium">
          Tipo de Adicción
        </label>
        <input
          type="text"
          id="tipoAdiccion"
          value={tipoAdiccion}
          onChange={(e) => setTipoAdiccion(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Tabaquismo, Alcoholismo"
          aria-label="Tipo de adicción"
          required
        />
      </div>
      <div>
        <label htmlFor="frecuencia" className="block text-sm font-medium">
          Frecuencia
        </label>
        <input
          type="text"
          id="frecuencia"
          value={frecuencia}
          onChange={(e) => setFrecuencia(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Diaria, Semanal"
          aria-label="Frecuencia de la adicción"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar adicción"
      >
        {loading ? "Guardando..." : "Guardar Adicción"}
      </button>
    </form>
  );
}