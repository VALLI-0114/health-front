import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ClusterDistributionChart() {
  const data = {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [48, 32, 20],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}
