// app/dashboard/fichas-medicas/add-section/AddConsultaMedicaForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addConsultaMedica } from "@/app/helpers/apifichasmedicas";

interface AddConsultaMedicaFormProps {
  fichaId: string;
  token: string;
}

export default function AddConsultaMedicaForm({
  fichaId,
  token,
}: AddConsultaMedicaFormProps) {
  const [motivo, setMotivo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addConsultaMedica(fichaId, { motivo, diagnostico, fecha }, token);
      toast.success("Consulta médica guardada con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar consulta médica");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="motivo" className="block text-sm font-medium">
          Motivo
        </label>
        <textarea
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Dolor abdominal"
          aria-label="Motivo de la consulta"
          required
        />
      </div>
      <div>
        <label htmlFor="diagnostico" className="block text-sm font-medium">
          Diagnóstico
        </label>
        <textarea
          id="diagnostico"
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Apendicitis"
          aria-label="Diagnóstico de la consulta"
          required
        />
      </div>
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium">
          Fecha
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          aria-label="Fecha de la consulta"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar consulta médica"
      >
        {loading ? "Guardando..." : "Guardar Consulta Médica"}
      </button>
    </form>
  );
}