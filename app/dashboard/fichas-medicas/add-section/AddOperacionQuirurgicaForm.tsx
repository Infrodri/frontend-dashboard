// app/dashboard/fichas-medicas/add-section/AddOperacionQuirurgicaForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addOperacionQuirurgica } from "@/app/helpers/apifichasmedicas";

interface AddOperacionQuirurgicaFormProps {
  fichaId: string;
  pacienteId: string;
  token: string;
}

export default function AddOperacionQuirurgicaForm({
  fichaId,
  pacienteId,
  token,
}: AddOperacionQuirurgicaFormProps) {
  const [tipoOperacionQuirurgica, setTipoOperacionQuirurgica] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOperacionQuirurgica(pacienteId, { tipoOperacionQuirurgica, fecha }, token);
      toast.success("Operación quirúrgica guardada con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar operación quirúrgica");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tipoOperacionQuirurgica" className="block text-sm font-medium">
          Tipo de Operación Quirúrgica
        </label>
        <input
          type="text"
          id="tipoOperacionQuirurgica"
          value={tipoOperacionQuirurgica}
          onChange={(e) => setTipoOperacionQuirurgica(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Apendicectomía"
          aria-label="Tipo de operación quirúrgica"
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
          aria-label="Fecha de la operación quirúrgica"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar operación quirúrgica"
      >
        {loading ? "Guardando..." : "Guardar Operación Quirúrgica"}
      </button>
    </form>
  );
}