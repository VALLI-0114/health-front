import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function AgeRiskChart() {
  const data = {
    labels: ["10–14", "15–18", "19–22"],
    datasets: [
      {
        label: "High Risk %",
        data: [12, 28, 40],
        backgroundColor: "#8b5cf6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar data={data} options={options} />;
}
