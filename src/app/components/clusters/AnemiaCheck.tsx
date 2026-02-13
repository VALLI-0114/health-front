import AnemiaSymptoms from "../symptoms/AnemiaSymptoms";
import React from "react";
export default function AnemiaCheck() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5">

      <h3 className="text-lg font-semibold text-gray-800">
        🩸 Anemia Risk Assessment
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-yellow-50">
          <p className="text-sm text-gray-600">Hemoglobin Level</p>
          <p className="text-xl font-bold text-yellow-700">11.5 g/dL</p>
          <p className="text-xs text-yellow-600">Mild Anemia</p>
        </div>

        <div className="p-4 rounded-lg bg-green-50">
          <p className="text-sm text-gray-600">BMI</p>
          <p className="text-xl font-bold text-green-700">18.7</p>
          <p className="text-xs text-green-600">Normal</p>
        </div>
      </div>

      <AnemiaSymptoms />

      <div className="p-4 bg-orange-50 rounded-lg text-sm text-orange-700">
        ⚠ Increase iron-rich foods and consider medical consultation.
      </div>
    </div>
  );
}
