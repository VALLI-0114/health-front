import React from "react";
interface Props {
  cluster: "anemia" | "pcod" | "combined" | "normal";
}

export default function AIRiskPrediction({ cluster }: Props) {
  const map = {
    anemia: {
      label: "Anemia Risk Detected",
      color: "bg-red-100 text-red-700",
    },
    pcod: {
      label: "PCOD Risk Detected",
      color: "bg-pink-100 text-pink-700",
    },
    combined: {
      label: "Anemia + PCOD Risk",
      color: "bg-orange-100 text-orange-700",
    },
    normal: {
      label: "Low Health Risk",
      color: "bg-green-100 text-green-700",
    },
  };

  return (
    <div className={`rounded-xl p-6 shadow ${map[cluster].color}`}>
      <h3 className="text-lg font-semibold">🤖 AI Risk Prediction</h3>
      <p className="mt-2 text-sm">
        {map[cluster].label}
      </p>
    </div>
  );
}
