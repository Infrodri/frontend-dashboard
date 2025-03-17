// app/components/Latest.tsx
import React, { HTMLAttributes } from "react";

interface LatestProps extends HTMLAttributes<HTMLDivElement> {
  latestItems: { id: string; nombre: string; estado: string; imagen: string }[];
}

export const Latest: React.FC<LatestProps> = ({ latestItems, className, ...props }) => {
  return (
    <div className={`p-4 bg-slate-800 rounded-lg shadow-md ${className}`} {...props}>
      <h3 className="text-lg font-semibold text-white mb-4">Pacientes Recientes</h3>
      <ul className="space-y-4">
        {latestItems.map((item) => (
          <li key={item.id} className="flex items-center gap-4">
            <img src={item.imagen} alt={item.nombre} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-white font-medium">{item.nombre}</p>
              <p className="text-sm text-gray-400">{item.estado}</p>
            </div>
          </li>
        ))}
      </ul>
      <footer className="mt-4 text-white text-sm">Total: {latestItems.length}</footer>
    </div>
  );
};