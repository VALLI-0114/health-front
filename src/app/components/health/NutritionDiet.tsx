import React from "react";
interface Props {
  cluster: "anemia" | "pcod" | "combined";
}

export default function NutritionDiet({ cluster }: Props) {
  const dietMap = {
    anemia: [
      "Iron-rich foods (spinach, dates)",
      "Vitamin C intake",
      "Avoid tea after meals",
    ],
    pcod: [
      "Low-GI foods",
      "High fiber diet",
      "Reduce sugar & refined carbs",
    ],
    combined: [
      "Iron + fiber rich foods",
      "Anti-inflammatory diet",
      "Regular meal timing",
    ],
  };

  return (
    <div className="bg-green-50 rounded-xl p-6 shadow">
      <h3 className="text-lg font-semibold text-green-700">
        🥗 Nutrition & Diet Plan
      </h3>

      <ul className="mt-3 space-y-2 text-sm text-green-900">
        {dietMap[cluster].map((item, i) => (
          <li key={i}>✔ {item}</li>
        ))}
      </ul>
    </div>
  );
}
