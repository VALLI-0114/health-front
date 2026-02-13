import React from "react";
interface Props {
  active: string;
  setActive: (v: string) => void;
}

export default function HealthTabs({ active, setActive }: Props) {
  const tabs = ["Vitals", "Nutrition", "Explainability"];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            active === tab
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
