import { useState } from "react";
import { Activity, AlertTriangle } from "lucide-react";
import { useHealth } from "../../context/HealthContext";
import React from "react";
const SYMPTOMS = [
  { key: "irregularPeriods", label: "Irregular / Missed Periods", weight: 3 },
  { key: "weightGain", label: "Sudden Weight Gain", weight: 2 },
  { key: "acne", label: "Severe Acne / Oily Skin", weight: 1 },
  { key: "hairGrowth", label: "Excess Facial / Body Hair", weight: 2 },
  { key: "hairLoss", label: "Hair Thinning / Hair Loss", weight: 1 },
  { key: "moodSwings", label: "Mood Swings / Depression", weight: 1 },
];

export default function PCODSymptoms() {
  const { setPcodScore } = useHealth();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string, weight: number) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);

    const score = SYMPTOMS.reduce(
      (sum, s) => sum + (updated[s.key] ? s.weight : 0),
      0
    );

    setPcodScore(score);
  };

  return (
    <div className="rounded-xl bg-white shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-purple-600" />
        <h3 className="font-semibold text-lg">PCOD Symptoms</h3>
      </div>

      <div className="space-y-3">
        {SYMPTOMS.map((s) => (
          <label
            key={s.key}
            className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-purple-50"
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
        PCOD risk increases with hormonal & menstrual symptoms.
      </div>
    </div>
  );
}
