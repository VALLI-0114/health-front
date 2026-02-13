import { useState } from "react";
import { Droplet, Wind, AlertTriangle } from "lucide-react";
import { useHealth } from "../../context/HealthContext";
import React from "react";
const SYMPTOMS = [
  { key: "fatigue", label: "Chronic Fatigue", weight: 2 },
  { key: "paleSkin", label: "Pale Skin / Lips", weight: 2 },
  { key: "dizziness", label: "Dizziness / Headaches", weight: 1 },
  { key: "shortBreath", label: "Shortness of Breath", weight: 2 },
  { key: "coldHands", label: "Cold Hands & Feet", weight: 1 },
];

export default function AnemiaSymptoms() {
  const { setAnemiaScore } = useHealth();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string, weight: number) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);

    const score = SYMPTOMS.reduce(
      (sum, s) => sum + (updated[s.key] ? s.weight : 0),
      0
    );

    setAnemiaScore(score);
  };

  return (
    <div className="rounded-xl bg-white shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <Droplet className="text-red-500" />
        <h3 className="font-semibold text-lg">Anemia Symptoms</h3>
      </div>

      <div className="space-y-3">
        {SYMPTOMS.map((s) => (
          <label
            key={s.key}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-red-50"
          >
            <span className="text-sm">{s.label}</span>
            <input
              type="checkbox"
              checked={checked[s.key] || false}
              onChange={() => toggle(s.key, s.weight)}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
        <AlertTriangle size={14} />
        Higher symptom count increases anemia risk cluster probability.
      </div>
    </div>
  );
}
