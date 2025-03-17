// app/dashboard/(overview)/page.tsx
import { bebas } from "@/app/ui/fonts";
import CardWrapper from "@/app/components/CardWrapper";
import { Suspense } from "react";
import { RevenueChartSkeleton } from "@/app/components/Skeleton";
import ChartWrapper from "@/app/components/ChartWrapper";
import MedicosListWrapper from "@/app/components/MedicosListWrapper";

const Dashboard = () => {
  return (
    <main>
      <h1 className={`${bebas.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
        <CardWrapper />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="w-full md:col-span-4">
          <h2 className={`${bebas.className} mb-4 text-xl md:text-2xl`}>
            Consultas por Especialidad
          </h2>
          <Suspense fallback={<RevenueChartSkeleton />}>
            <ChartWrapper />
          </Suspense>
        </div>
        <div className="w-full md:col-span-4">
          <h2 className={`${bebas.className} mb-4 text-xl md:text-2xl`}>
            Médicos Activos
          </h2>
          <Suspense fallback={<div>Cargando médicos...</div>}>
            <MedicosListWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;