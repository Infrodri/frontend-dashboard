// app/dashboard/fichas-medicas/edit/EditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updateFichaMedica } from "@/app/helpers/apifichasmedicas";
import { FichaMedica, Paciente } from "@/app/types/FichasMedicasTypes";

interface EditFormProps {
  ficha: FichaMedica;
  pacientes: Paciente[];
  token: string;
}

export default function EditForm({ ficha, pacientes, token }: EditFormProps) {
  const [pacienteId, setPacienteId] = useState(
    typeof ficha.paciente === "string" ? ficha.paciente : ficha.paciente._id
  );
  const [estado, setEstado] = useState(ficha.estado);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateFichaMedica(ficha._id, { paciente: pacienteId, estado }, token);
      toast.success("Ficha médica actualizada con éxito");
      router.push(`/dashboard/fichas-medicas/details/${ficha._id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar la ficha médica");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="paciente" className="block text-sm font-medium">
          Paciente
        </label>
        <select
          id="paciente"
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          aria-label="Seleccionar paciente"
          required
        >
          <option value="">Selecciona un paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente._id} value={paciente._id}>
              {paciente.primerNombre} {paciente.primerApellido} - {paciente.cedula}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="estado" className="block text-sm font-medium">
          Estado
        </label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as "Activo" | "Inactivo")}
          className="mt-1 block w-full p-2 border rounded"
          aria-label="Seleccionar estado de la ficha"
          required
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        aria-label="Actualizar ficha médica"
      >
        {loading ? "Actualizando..." : "Actualizar Ficha Médica"}
      </button>
    </form>
  );
}