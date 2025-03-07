import CardWrapper from "@/app/components/CardWrapper";
import ChartWrapper from "@/app/components/ChartWrapper";
import LatestInvoicesWrapper from "@/app/components/LatestInvoicesWrapper";
import { RevenueChartSkeleton } from "@/app/components/Skeleton";
import { bebas } from "@/app/ui/fonts";
import { Suspense } from "react";



const Dashboard = () => {
    return (
        <main>
            <h1 className={`${bebas.className} mb-4 text-xl md:text-2xl`}>Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <CardWrapper />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <div className="w-full md:col-span-4">
                <h2 className={`${bebas.className} text-xl md:text-2xl`}>Recent Revenues</h2>
                <Suspense fallback={<RevenueChartSkeleton />}>
                <ChartWrapper />
                </Suspense>
                </div>
                <div className="w-full md:col-span-4">
                <h2 className={`${bebas.className} text-xl md:text-2xl`}>Latest invoices</h2>
                <LatestInvoicesWrapper />
                </div>
            </div>
            </main>
    );
};
export default Dashboard;