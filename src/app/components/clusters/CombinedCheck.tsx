import CombinedSymptoms from "../symptoms/CombinedSymptoms";
import React from "react";
export default function CombinedCheck() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">

      <h3 className="text-lg font-semibold text-gray-800">
        ⚠ Anemia + PCOD Combined Risk
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm">Hemoglobin</p>
          <p className="text-lg font-bold text-yellow-700">10.8 g/dL</p>
        </div>

        <div className="p-4 bg-pink-50 rounded-lg">
          <p className="text-sm">Cycle Status</p>
          <p className="text-lg font-bold text-pink-600">Irregular</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm">Overall Risk</p>
          <p className="text-lg font-bold text-purple-700">High</p>
        </div>
      </div>

      <CombinedSymptoms />

      <div className="p-4 bg-red-50 rounded-lg text-sm text-red-700">
        🚨 High combined risk detected. Immediate clinical screening advised.
      </div>
    </div>
  );
}
