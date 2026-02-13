import { MapPin, Phone, Stethoscope } from "lucide-react";
import React from "react";
export default function HospitalReferrals({ isDark }: { isDark: boolean }) {
  const hospitals = [
    {
      name: "District Government Hospital",
      specialist: "Gynecology & Hematology",
      phone: "108 / 08922-XXXX",
    },
    {
      name: "Community Health Center",
      specialist: "Adolescent Care",
      phone: "08922-YYYY",
    },
  ];

  return (
    <div className={`rounded-xl p-5 shadow ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Stethoscope />
        Hospital Referrals
      </h3>

      <div className="space-y-3">
        {hospitals.map((h) => (
          <div
            key={h.name}
            className="p-3 rounded-lg border flex flex-col gap-1"
          >
            <span className="font-medium">{h.name}</span>
            <span className="text-sm text-gray-500">
              {h.specialist}
            </span>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Phone size={14} />
              {h.phone}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 text-gray-500">
        Recommended when cluster risk is Moderate to Severe.
      </p>
    </div>
  );
}
