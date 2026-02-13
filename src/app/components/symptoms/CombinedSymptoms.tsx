import { useHealth } from "../../context/HealthContext";
import { Layers, AlertOctagon } from "lucide-react";
import React from "react";
export default function CombinedSymptoms() {
  const { anemiaScore, pcodScore } = useHealth();

  const combinedScore = anemiaScore + pcodScore;

  let riskLevel: "Low" | "Moderate" | "High" = "Low";

  if (combinedScore >= 7) riskLevel = "High";
  else if (combinedScore >= 4) riskLevel = "Moderate";

  return (
    <div className="rounded-xl bg-white shadow p-5 border border-pink-200">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-pink-600" />
        <h3 className="font-semibold text-lg">
          Combined Anemia + PCOD Risk
        </h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Anemia Score</span>
          <span className="font-semibold">{anemiaScore}</span>
        </div>

        <div className="flex justify-between">
          <span>PCOD Score</span>
          <span className="font-semibold">{pcodScore}</span>
        </div>

        <div className="flex justify-between border-t pt-2 mt-2">
          <span>Total Combined Risk</span>
          <span className="font-semibold">{combinedScore}</span>
        </div>
      </div>

      <div
        className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          riskLevel === "High"
            ? "bg-red-100 text-red-700"
            : riskLevel === "Moderate"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        <AlertOctagon size={16} />
        <span>
          Risk Level: <strong>{riskLevel}</strong>
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Combined cluster indicates hormonal imbalance with nutritional
        deficiency. Early intervention is strongly recommended.
      </p>
    </div>
  );
}
