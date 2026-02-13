import { useState } from "react";
import { CalendarHeart } from "lucide-react";
import React from "react";
interface Props {
  onCycleChange?: (irregular: boolean) => void;
  isDark?: boolean;
}

export default function MenstrualHealthTracker({
  onCycleChange,
  isDark,
}: Props) {
  const [cycle, setCycle] = useState("regular");

  const handleChange = (value: string) => {
    setCycle(value);
    onCycleChange?.(value === "irregular");
  };

  return (
    <div className={`rounded-xl p-5 shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarHeart />
        <h3 className="font-semibold text-lg">Menstrual Health</h3>
      </div>

      <div className="space-y-2">
        {["regular", "irregular", "missed"].map((type) => (
          <label
            key={type}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="cycle"
              value={type}
              checked={cycle === type}
              onChange={(e) => handleChange(e.target.value)}
            />
            <span className="capitalize text-sm">{type} cycles</span>
          </label>
        ))}
      </div>

      {cycle !== "regular" && (
        <p className="mt-3 text-sm text-red-500">
          ⚠ Irregular cycles may indicate PCOD risk.
        </p>
      )}
    </div>
  );
}
