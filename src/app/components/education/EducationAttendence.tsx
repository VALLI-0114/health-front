import { useState } from "react";
import React from "react";
export default function EducationAttendance() {
  const [attendance, setAttendance] = useState(85);
  const [performance, setPerformance] = useState("Good");

  const getAttendanceStatus = () => {
    if (attendance >= 85) return { label: "Excellent", color: "text-green-600" };
    if (attendance >= 70) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  };

  const status = getAttendanceStatus();

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-5 animate-fade-in">

      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        🎓 Education & Attendance Linkage
      </h3>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">
            School Attendance (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={attendance}
            onChange={(e) => setAttendance(Number(e.target.value))}
            className="w-full mt-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">
            Academic Performance
          </label>
          <select
            value={performance}
            onChange={(e) => setPerformance(e.target.value)}
            className="w-full mt-1 rounded-lg border px-3 py-2 focus:ring-2 focus:ring-purple-400"
          >
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-blue-50">
          <p className="text-sm text-gray-600">Attendance Status</p>
          <p className={`text-xl font-bold ${status.color}`}>
            {attendance}% – {status.label}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-indigo-50">
          <p className="text-sm text-gray-600">Academic Status</p>
          <p className="text-xl font-bold text-indigo-700">
            {performance}
          </p>
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 bg-green-50 rounded-lg text-sm text-green-700">
        ✔ Good attendance and academic engagement are associated with better
        physical and mental health outcomes in adolescents.
      </div>

    </div>
  );
}
