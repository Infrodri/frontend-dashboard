import React from "react";
import { fetchRevenue } from "../helpers/api";
import { RevenueChart } from "anjrot-components";

const ChartWrapper = async () => {
    const revenue = await fetchRevenue();
    console.log("Revenue data:", revenue);
    return <RevenueChart revenues={revenue} chartHeight={350}
    className="bg-slate-700"/>;
};

export default ChartWrapper;