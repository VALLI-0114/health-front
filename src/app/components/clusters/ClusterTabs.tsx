import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const clusterData = [
  { name: "Anemia", value: 420 },
  { name: "PCOD", value: 280 },
  { name: "Anemia + PCOD", value: 160 },
];

const ageRiskData = [
  { age: "13-15", anemia: 60, pcod: 20, combined: 10 },
  { age: "16-18", anemia: 120, pcod: 90, combined: 50 },
  { age: "19-22", anemia: 240, pcod: 170, combined: 100 },
];

const COLORS = ["#F59E0B", "#EC4899", "#8B5CF6"];

export default function PopulationAnalytics() {
  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Population Health Analytics
        </h2>
        <p className="text-sm text-gray-500">
          AI-driven insights based on clustered adolescent health data
        </p>
      </div>

      {/* Cluster Distribution */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Cluster Distribution
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={clusterData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {clusterData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around mt-4 text-sm">
            <span className="text-yellow-600">● Anemia</span>
            <span className="text-pink-600">● PCOD</span>
            <span className="text-purple-600">● Combined</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-700">
            Key Observations
          </h3>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Anemia is the most prevalent condition</li>
            <li>• PCOD risk increases with age</li>
            <li>• Combined risk observed in late adolescence</li>
            <li>• Nutrition and lifestyle strongly influence outcomes</li>
          </ul>

          <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">
            ✔ Early screening can reduce severe outcomes by 40%
          </div>
        </div>
      </div>

      {/* Age-wise Risk */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4 text-gray-700">
          Age-wise Risk Distribution
        </h3>

        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={ageRiskData}>
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="anemia" fill="#F59E0B" />
              <Bar dataKey="pcod" fill="#EC4899" />
              <Bar dataKey="combined" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Data aggregated from adolescent population (13–22 years)
        </p>
      </div>
    </div>
  );
}
