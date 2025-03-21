// app/dashboard/fichas-medicas/add-section/AddGinecologiaObstetricaForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addGinecologiaObstetrica } from "@/app/helpers/apifichasmedicas";

interface AddGinecologiaObstetricaFormProps {
  fichaId: string;
  pacienteId: string;
  token: string;
}

export default function AddGinecologiaObstetricaForm({
  fichaId,
  pacienteId,
  token,
}: AddGinecologiaObstetricaFormProps) {
  const [tipoObstetricoGinecologico, setTipoObstetricoGinecologico] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGinecologiaObstetrica(pacienteId, { tipoObstetricoGinecologico, fecha }, token);
      toast.success("Registro de ginecología/obstetricia guardado con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar registro de ginecología/obstetricia");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="tipoObstetricoGinecologico" className="block text-sm font-medium">
          Tipo de Registro
        </label>
        <input
          type="text"
          id="tipoObstetricoGinecologico"
          value={tipoObstetricoGinecologico}
          onChange={(e) => setTipoObstetricoGinecologico(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. Parto, Cesárea"
          aria-label="Tipo de registro ginecológico/obstétrico"
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
          aria-label="Fecha del registro"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar registro de ginecología/obstetricia"
      >
        {loading ? "Guardando..." : "Guardar Registro"}
      </button>
    </form>
  );
}