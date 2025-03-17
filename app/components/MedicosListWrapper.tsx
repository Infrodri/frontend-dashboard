// app/dashboard/(overview)/MedicosListWrapper.tsx
import { fetchMedicosList } from "@/app/helpers/api";
import MedicosList from "./MedicosList";
import React from "react";

const MedicosListWrapper = async () => {
  try {
    const medicos = await fetchMedicosList();
    console.log("Data passed to MedicosList:", medicos);
    return (
      <MedicosList
        medicos={medicos}
        className=""
        footerClassName="text-gray-500 text-sm"
      />
    );
  } catch (error) {
    console.error("Error in MedicosListWrapper:", error);
    return <div className="text-gray-500">No se pudieron cargar los médicos.</div>;
  }
};

export default MedicosListWrapper;