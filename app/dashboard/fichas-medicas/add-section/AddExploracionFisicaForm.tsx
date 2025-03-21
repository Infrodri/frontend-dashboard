// app/dashboard/fichas-medicas/add-section/AddExploracionFisicaForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { addExploracionFisica } from "@/app/helpers/apifichasmedicas";
import { ExploracionFisica } from "@/app/types/FichasMedicasTypes";

interface AddExploracionFisicaFormProps {
  fichaId: string;
  pacienteId: string;
  existingData?: ExploracionFisica;
  token: string;
}

export default function AddExploracionFisicaForm({
  fichaId,
  pacienteId,
  existingData,
  token,
}: AddExploracionFisicaFormProps) {
  const [peso, setPeso] = useState(existingData?.peso?.toString() || "");
  const [altura, setAltura] = useState(existingData?.altura?.toString() || "");
  const [presionArterial, setPresionArterial] = useState(existingData?.presionArterial || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      peso: peso ? parseFloat(peso) : undefined,
      altura: altura ? parseFloat(altura) : undefined,
      presionArterial: presionArterial || undefined,
    };

    try {
      await addExploracionFisica(pacienteId, data, token);
      toast.success("Exploración física guardada con éxito");
      router.push(`/dashboard/fichas-medicas/details/${fichaId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al guardar exploración física");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="peso" className="block text-sm font-medium">
          Peso (kg)
        </label>
        <input
          type="number"
          id="peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. 70"
          aria-label="Peso del paciente"
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="altura" className="block text-sm font-medium">
          Altura (cm)
        </label>
        <input
          type="number"
          id="altura"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. 170"
          aria-label="Altura del paciente"
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="presionArterial" className="block text-sm font-medium">
          Presión Arterial (mmHg)
        </label>
        <input
          type="text"
          id="presionArterial"
          value={presionArterial}
          onChange={(e) => setPresionArterial(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="Ej. 120/80"
          aria-label="Presión arterial del paciente"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Guardar exploración física"
      >
        {loading ? "Guardando..." : "Guardar Exploración Física"}
      </button>
    </form>
  );
}