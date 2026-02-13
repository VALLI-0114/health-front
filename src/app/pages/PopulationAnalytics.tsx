import ClusterDistributionChart from "../components/analytics/ClusterDistributionChart";
import AgeRiskChart from "../components/analytics/AgeRiskChart";
import React from "react";

export default function PopulationAnalytics() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-purple-800">
          Population Health Analytics
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          AI-driven insights based on clustered Anaemia & PCOD risk patterns
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cluster Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Cluster Distribution
          </h3>
          <ClusterDistributionChart />
        </div>

        {/* Age vs Risk */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            Age vs Risk
          </h3>
          <AgeRiskChart />
        </div>
      </div>
    </div>
  );
}
