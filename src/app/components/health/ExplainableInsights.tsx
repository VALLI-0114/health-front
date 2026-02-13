import React from "react";
interface Props {
  reasons: string[];
}

export default function ExplainableInsights({ reasons }: Props) {
  if (reasons.length === 0) return null;

  return (
    <div className="bg-indigo-50 rounded-xl p-6 shadow animate-fade-in">
      <h3 className="text-lg font-semibold text-indigo-700 mb-2">
        🔍 Explainable AI Insights
      </h3>

      <ul className="list-disc list-inside space-y-1 text-sm text-indigo-900">
        {reasons.map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}
