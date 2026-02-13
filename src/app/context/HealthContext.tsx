import { createContext, useContext, useState } from "react";
import React from "react";
/* ---------------- TYPES ---------------- */
export type ClusterType =
  | "ANEMIA"
  | "PCOD"
  | "COMBINED"
  | "NORMAL"
  | null;

export interface ClusterResult {
  anemiaRisk?: number;        // %
  pcodRisk?: number;          // %
  combinedRisk?: number;      // %
  anemiaCluster?: number;     // HDBSCAN label
  pcodCluster?: number;
  combinedCluster?: number;
}

interface HealthContextType {
  /* vitals */
  bmi: number;
  hb: number;

  /* rule / ml scores */
  anemiaScore: number;
  pcodScore: number;

  /* cluster decision */
  cluster: ClusterType;

  /* ml output */
  clusterResult: ClusterResult;

  /* setters */
  setBmi: (v: number) => void;
  setHb: (v: number) => void;
  setAnemiaScore: (v: number) => void;
  setPcodScore: (v: number) => void;
  setClusterResult: (data: ClusterResult) => void;

  /* logic */
  evaluateCluster: () => void;
  resetHealth: () => void;
}

/* ---------------- CONTEXT ---------------- */
const HealthContext = createContext<HealthContextType | null>(null);

/* ---------------- PROVIDER ---------------- */
export const HealthProvider = ({ children }: { children: React.ReactNode }) => {
  const [bmi, setBmi] = useState(0);
  const [hb, setHb] = useState(0);

  const [anemiaScore, setAnemiaScore] = useState(0);
  const [pcodScore, setPcodScore] = useState(0);

  const [cluster, setCluster] = useState<ClusterType>(null);
  const [clusterResult, setClusterResult] = useState<ClusterResult>({});

  /* ---------- CLUSTER LOGIC (RULE → ML READY) ---------- */
  const evaluateCluster = () => {
    if (anemiaScore >= 3 && pcodScore >= 3) {
      setCluster("COMBINED");
    } else if (anemiaScore >= 3) {
      setCluster("ANEMIA");
    } else if (pcodScore >= 3) {
      setCluster("PCOD");
    } else {
      setCluster("NORMAL");
    }
  };

  const resetHealth = () => {
    setBmi(0);
    setHb(0);
    setAnemiaScore(0);
    setPcodScore(0);
    setCluster(null);
    setClusterResult({});
  };

  return (
    <HealthContext.Provider
      value={{
        bmi,
        hb,
        anemiaScore,
        pcodScore,
        cluster,
        clusterResult,
        setBmi,
        setHb,
        setAnemiaScore,
        setPcodScore,
        setClusterResult,
        evaluateCluster,
        resetHealth,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */
export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth must be used inside HealthProvider");
  }
  return context;
};
