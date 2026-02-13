import PCODSymptoms from "../symptoms/PCODSymptoms";
import React from "react";
export default function PCODCheck() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">

      <h3 className="text-lg font-semibold text-gray-800">
        🌸 PCOD Risk Assessment
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-pink-50">
          <p className="text-sm text-gray-600">Cycle Regularity</p>
          <p className="text-xl font-bold text-pink-600">Regular</p>
        </div>

        <div className="p-4 rounded-lg bg-purple-50">
          <p className="text-sm text-gray-600">Symptoms Detected</p>
          <p className="text-xl font-bold text-purple-600">0 / 5</p>
        </div>
      </div>

      <PCODSymptoms />

      <div className="p-4 bg-green-50 rounded-lg text-sm text-green-700">
        ✔ Low PCOD risk based on current inputs.
      </div>
    </div>
  );
}
