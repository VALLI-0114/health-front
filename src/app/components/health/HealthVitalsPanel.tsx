import { useState } from "react";
import React from "react";
interface Props {
  onVitalsChange?: (data: any) => void;
}

export default function HealthVitalsPanel({ onVitalsChange }: Props) {
  const [height, setHeight] = useState(155);
  const [weight, setWeight] = useState(48);
  const [hb, setHb] = useState(11.2);

  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);

  const update = () => {
    onVitalsChange?.({ height, weight, bmi, hb });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800">
        🧍 Health Vitals
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(+e.target.value)}
          onBlur={update}
          placeholder="Height (cm)"
          className="input"
        />

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(+e.target.value)}
          onBlur={update}
          placeholder="Weight (kg)"
          className="input"
        />

        <input
          type="number"
          value={hb}
          onChange={(e) => setHb(+e.target.value)}
          onBlur={update}
          placeholder="Hemoglobin (g/dL)"
          className="input"
        />
      </div>

      <div className="flex gap-4 text-sm">
        <span>BMI: <b>{bmi}</b></span>
        <span>Hb: <b>{hb} g/dL</b></span>
      </div>
    </div>
  );
}
