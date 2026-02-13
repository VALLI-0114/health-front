import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

/* Temporary local type since blockchain service was removed */
interface BlockchainRecord {
  hash: string;
  cluster: string;
  timestamp: string;
}

export default function BlockchainRecords() {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);

  /* Since blockchain service was deleted,
     we simulate empty records */
  useEffect(() => {
    setTimeout(() => {
      setRecords([]); // No backend call
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Blockchain Health Records
          </h1>
          <p className="text-sm text-gray-600">
            Blockchain module has been disabled.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">
            No blockchain records available.
          </p>
        ) : (
          <div className="grid gap-4">
            {records.map((record, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-sm p-5"
              >
                <p className="text-sm text-gray-600">
                  <strong>Hash:</strong> {record.hash}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Cluster:</strong>{" "}
                  <span className="font-medium text-purple-600">
                    {record.cluster}
                  </span>
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {record.timestamp}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}