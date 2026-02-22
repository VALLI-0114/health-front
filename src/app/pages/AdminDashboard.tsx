// src/app/pages/AdminDashboard.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Users, Activity, TrendingUp, Database, Filter, Download,
  Radio, AlertCircle, CheckCircle, Clock, ShieldCheck, ShieldAlert,
  Search, X, ChevronUp, ChevronDown, Upload, BarChart3, Bell,
  RefreshCw, Eye, Heart, Zap, FileSpreadsheet, AlertTriangle,
  UserCheck, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const REFRESH_INTERVAL = 10000;

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface ActivityItem {
  id: number;
  type: "anemia" | "pcod" | "combined";
  userId: number;
  userName: string;
  result: string;
  timestamp: string;
  verified: boolean;
}

interface ClusterStats {
  anemiaHighRisk: number;
  anemiaMediumRisk: number;
  anemiaLowRisk: number;
  pcodHighRisk: number;
  pcodMediumRisk: number;
  pcodLowRisk: number;
}

interface DashboardStats {
  totalUsers: number;
  anemiaChecks: number;
  pcodChecks: number;
  combinedChecks: number;
  blockchainRecords: number;
  recentActivity: ActivityItem[];
  clusterStats: ClusterStats;
}

interface PredictionRow {
  roll_no: string;
  age: number | string;
  bmi: number | string;
  hemoglobin: number | string;
  prediction: string;
  confidence: number | string;
  status: string;
  isSafe: boolean;
}

type SortKey = keyof PredictionRow;
type SortDir = "asc" | "desc";
type TabId = "overview" | "bulk" | "activity" | "analytics" | "alerts";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart3 /> },
  { id: "bulk", label: "Bulk Analysis", icon: <FileSpreadsheet /> },
  { id: "activity", label: "Live Activity", icon: <Activity /> },
  { id: "analytics", label: "Analytics", icon: <TrendingUp /> },
  { id: "alerts", label: "Alerts", icon: <Bell /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "all">("week");
  const [isLive, setIsLive] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [newActivityIds, setNewActivityIds] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [predictionRows, setPredictionRows] = useState<PredictionRow[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Safe" | "Anemia" | "PCOD">("all");
  const [sortKey, setSortKey] = useState<SortKey>("roll_no");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevActivityRef = useRef<ActivityItem[]>([]);

  useEffect(() => {
    loadDashboardData();
    startPolling();
    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const startPolling = () => {
    stopPolling();
    intervalRef.current = setInterval(() => loadDashboardData(true), REFRESH_INTERVAL);
    setIsLive(true);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsLive(false);
  };

  const loadDashboardData = async (silent = false) => {
    try {
      if (!silent) { setLoading(true); setError(null); }
      const token = localStorage.getItem("auth_token");
      if (!token) { navigate("/admin-login"); return; }
      const res = await fetch(`${API_BASE_URL}/admin/dashboard?period=${timeFilter}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) throw new Error("Session expired.");
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const data = await res.json();
      if (prevActivityRef.current.length > 0 && data.recentActivity) {
        const prevIds = new Set(prevActivityRef.current.map((a: ActivityItem) => `${a.type}-${a.id}`));
        const newIds = new Set<string>();
        data.recentActivity.forEach((a: ActivityItem) => {
          if (!prevIds.has(`${a.type}-${a.id}`)) newIds.add(`${a.type}-${a.id}`);
        });
        if (newIds.size > 0) {
          setNewActivityIds(newIds);
          setTimeout(() => setNewActivityIds(new Set()), 3000);
        }
      }
      prevActivityRef.current = data.recentActivity || [];
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDownloadReport = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/admin-login"); return; }
    try {
      setDownloadingReport(true);
      const res = await fetch(`${API_BASE_URL}/admin/export?period=${timeFilter}`, {
        headers: { Authorization: `Bearer ${token}` }, credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      triggerDownload(await res.blob(), `admin_report_${timeFilter}_${todayStr()}.xlsx`);
      showSuccess("Dashboard report downloaded!");
    } catch { alert("Failed to download report"); }
    finally { setDownloadingReport(false); }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
      alert("Only .xlsx or .csv files are allowed"); e.target.value = ""; return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5 MB"); e.target.value = ""; return;
    }
    setUploadFile(file);
    setPredictionRows([]); setShowResults(false); setResultBlob(null);
  };

  const parseXlsxBlob = async (blob: Blob): Promise<PredictionRow[]> => {
    let XLSX: any;
    try { XLSX = await import("xlsx"); } catch { XLSX = (window as any).XLSX; }
    if (!XLSX) throw new Error("SheetJS not found. Run: npm install xlsx");
    const ab = await blob.arrayBuffer();
    const wb = XLSX.read(ab, { type: "array" });
    const sheetName = wb.SheetNames.includes("Results") ? "Results" : wb.SheetNames[0];
    const raw: Record<string, any>[] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
    return raw.map((r) => {
      const pred = String(r["Prediction"] ?? r["prediction"] ?? "").trim();
      return {
        roll_no: String(r["roll_no"] ?? r["Roll No"] ?? "").trim(),
        age: r["age"] ?? r["Age"] ?? "",
        bmi: typeof r["bmi"] === "number" ? Number(r["bmi"]).toFixed(2) : r["bmi"] ?? "",
        hemoglobin: r["hemoglobin"] ?? r["Hemoglobin"] ?? "",
        prediction: pred,
        confidence: r["Confidence (%)"] ?? r["confidence"] ?? "",
        status: String(r["Status"] ?? r["status"] ?? "").trim(),
        isSafe: pred === "Safe",
      };
    });
  };

  const handleAnalyze = async () => {
    if (!uploadFile) { alert("Please select a file"); return; }
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/admin-login"); return; }
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("save_to_db", "true");
    try {
      setUploading(true); setSuccessMessage(null);
      setPredictionRows([]); setShowResults(false); setResultBlob(null);
      const res = await fetch(`${API_BASE_URL}/admin/bulk-upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.status === 401 || res.status === 403) { navigate("/admin-login"); return; }
      if (!res.ok) {
        let msg = "Upload failed";
        try { const d = await res.json(); msg = d.error || d.message || msg; } catch {}
        throw new Error(msg);
      }
      const blob = await res.blob();
      setResultBlob(blob);
      const rows = await parseXlsxBlob(blob);
      setPredictionRows(rows); setShowResults(true);
      setFilterText(""); setFilterStatus("all");
      setSortKey("roll_no"); setSortDir("asc");
      showSuccess(`Analysis complete — ${rows.length} records processed.`);
      setUploadFile(null);
      const fi = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fi) fi.value = "";
      await loadDashboardData(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk analysis failed");
    } finally { setUploading(false); }
  };

  const handleDownloadResults = () => {
    if (!resultBlob) return;
    triggerDownload(resultBlob, `ml_predictions_${todayStr()}.xlsx`);
    showSuccess("Results downloaded!");
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filteredRows = predictionRows
    .filter(r => {
      const matchText = filterText ? r.roll_no.toLowerCase().includes(filterText.toLowerCase()) : true;
      const matchStatus = filterStatus === "all" ? true : r.prediction === filterStatus;
      return matchText && matchStatus;
    })
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const safeCnt = predictionRows.filter(r => r.prediction === "Safe").length;
  const anemiaCnt = predictionRows.filter(r => r.prediction === "Anemia").length;
  const pcodCnt = predictionRows.filter(r => r.prediction === "PCOD").length;
  const alertCnt = anemiaCnt + pcodCnt;

  // ── Light Pink Theme ──────────────────────────────────────────────────────
  const theme = {
    bg: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 45%, #fdf2f8 100%)",
    card: "rgba(255,255,255,0.75)",
    cardSolid: "#ffffff",
    border: "rgba(233,30,140,0.15)",
    borderStrong: "rgba(233,30,140,0.3)",
    primary: "#e91e8c",
    primaryDark: "#c2185b",
    primaryLight: "#f48fb1",
    primaryGlow: "rgba(233,30,140,0.2)",
    primaryBg: "rgba(233,30,140,0.08)",
    text: "#7b2d5e",
    textMuted: "#c084a8",
    textStrong: "#4a1040",
    heading: "#3d0c32",
    shadow: "0 4px 24px rgba(233,30,140,0.1)",
    shadowMd: "0 8px 32px rgba(233,30,140,0.15)",
    inputBg: "rgba(255,240,248,0.9)",
    successBg: "rgba(16,185,129,0.1)",
    successText: "#065f46",
    successBorder: "rgba(16,185,129,0.3)",
    errorBg: "rgba(244,63,94,0.08)",
    errorText: "#9f1239",
    warningBg: "rgba(245,158,11,0.08)",
    warningText: "#92400e",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${theme.primaryLight}`, borderTopColor: theme.primary, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: theme.text, fontWeight: 600, fontSize: "0.95rem" }}>Loading dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: theme.cardSolid, border: `1px solid ${theme.borderStrong}`, borderRadius: 20, padding: "2rem", maxWidth: 380, width: "100%", textAlign: "center", boxShadow: theme.shadowMd }}>
        <AlertCircle style={{ color: "#e91e8c", width: 40, height: 40, margin: "0 auto 12px" }} />
        <h2 style={{ color: theme.heading, fontWeight: 700, marginBottom: 8 }}>Error</h2>
        <p style={{ color: theme.text, marginBottom: 20, fontSize: "0.9rem" }}>{error}</p>
        <button onClick={() => loadDashboardData()} className="w-full py-2.5 rounded-xl text-white font-bold mb-3" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, border: "none", cursor: "pointer", padding: "10px", borderRadius: 12, color: "white", fontWeight: 700, marginBottom: 12, width: "100%" }}>Retry</button>
        <button onClick={() => navigate("/admin-login")} style={{ background: theme.primaryBg, border: `1px solid ${theme.border}`, cursor: "pointer", padding: "10px", borderRadius: 12, color: theme.primary, fontWeight: 600, width: "100%" }}>Back to Login</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,64,122,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,182,193,0.12) 0%, transparent 70%)", transform: "translateX(-50%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "24px 20px" }}>
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${theme.primaryGlow}` }}>
              <Heart style={{ width: 24, height: 24, color: "white" }} />
            </div>
            <div>
              <h1 style={{ color: theme.heading, fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.1, margin: 0 }}>Women's Health Admin</h1>
              <p style={{ color: theme.textMuted, fontSize: "0.75rem", margin: "2px 0 0" }}>Last synced {lastRefresh.toLocaleTimeString()}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isLive && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "5px 12px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s infinite" }} />
                <span style={{ color: "#059669", fontSize: "0.75rem", fontWeight: 700 }}>Live</span>
              </div>
            )}
            <button onClick={() => loadDashboardData()} title="Refresh" style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 10, cursor: "pointer", color: theme.primary, display: "flex", alignItems: "center", boxShadow: theme.shadow }}>
              <RefreshCw style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={handleDownloadReport} disabled={downloadingReport} style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, border: "none", borderRadius: 12, padding: "10px 18px", cursor: "pointer", color: "white", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: `0 4px 14px ${theme.primaryGlow}` }}>
              <Download style={{ width: 15, height: 15 }} />
              {downloadingReport ? "Exporting…" : "Export Report"}
            </button>
          </div>
        </div>

        {/* ── Success banner ── */}
        {successMessage && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle style={{ width: 18, height: 18, color: "#10b981", flexShrink: 0 }} />
            <span style={{ color: "#065f46", fontWeight: 600, fontSize: "0.875rem" }}>{successMessage}</span>
          </div>
        )}

        {/* ── Navigation Tabs ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24, background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 6, flexWrap: "wrap", boxShadow: theme.shadow }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 11,
                fontSize: "0.85rem", fontWeight: 600,
                border: "none", cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                ...(activeTab === tab.id
                  ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white", boxShadow: `0 4px 14px ${theme.primaryGlow}` }
                  : { background: "transparent", color: theme.text })
              }}
            >
              {React.cloneElement(tab.icon as React.ReactElement, { style: { width: 15, height: 15 } })}
              {tab.label}
              {tab.id === "alerts" && alertCnt > 0 && (
                <span style={{ background: "#ef4444", color: "white", borderRadius: 20, fontSize: "0.65rem", fontWeight: 800, padding: "1px 6px", marginLeft: 2 }}>
                  {alertCnt > 9 ? "9+" : alertCnt}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Time Filter ── */}
        {(activeTab === "overview" || activeTab === "analytics") && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ color: theme.textMuted, fontSize: "0.8rem", fontWeight: 600 }}>Period:</span>
            {(["today", "week", "month", "all"] as const).map(p => (
              <button key={p} onClick={() => setTimeFilter(p)} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer",
                ...(timeFilter === p
                  ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white", boxShadow: `0 2px 10px ${theme.primaryGlow}` }
                  : { background: theme.cardSolid, border: `1px solid ${theme.border}`, color: theme.text })
              }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              <KpiCard theme={theme} icon={<Users />} value={stats?.totalUsers ?? 0} label="Total Users" sub="All time" color={theme.primary} />
              <KpiCard theme={theme} icon={<Activity />} value={stats?.anemiaChecks ?? 0} label="Anemia Checks" sub={`This ${timeFilter}`} color="#f43f5e" />
              <KpiCard theme={theme} icon={<Eye />} value={stats?.pcodChecks ?? 0} label="PCOD Checks" sub={`This ${timeFilter}`} color="#ec4899" />
              <KpiCard theme={theme} icon={<Database />} value={stats?.combinedChecks ?? 0} label="Combined" sub={`This ${timeFilter}`} color="#db2777" />
            </div>

            {stats?.clusterStats && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                <RiskPanel theme={theme} title="Anemia Risk Distribution" icon={<Activity />} high={stats.clusterStats.anemiaHighRisk} medium={stats.clusterStats.anemiaMediumRisk} low={stats.clusterStats.anemiaLowRisk} />
                <RiskPanel theme={theme} title="PCOD Risk Distribution" icon={<Heart />} high={stats.clusterStats.pcodHighRisk} medium={stats.clusterStats.pcodMediumRisk} low={stats.clusterStats.pcodLowRisk} />
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              <QuickStat theme={theme} label="Blockchain Records" value={stats?.blockchainRecords ?? 0} icon={<Database />} color="#ef4444" />
              <QuickStat theme={theme} label="Verified Checks" value={stats?.recentActivity?.filter(a => a.verified).length ?? 0} icon={<ShieldCheck />} color="#a855f7" />
              <QuickStat theme={theme} label="Active Users" value={stats?.totalUsers ?? 0} icon={<UserCheck />} color="#10b981" />
            </div>
          </div>
        )}

        {/* ════ BULK ANALYSIS ════ */}
        {activeTab === "bulk" && (
          <div>
            {/* Upload card */}
            <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: theme.shadow }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileSpreadsheet style={{ width: 20, height: 20, color: theme.primary }} />
                </div>
                <div>
                  <h2 style={{ color: theme.heading, fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>Bulk ML Health Analysis</h2>
                  <p style={{ color: theme.textMuted, fontSize: "0.8rem", margin: "2px 0 0" }}>Upload student data for instant AI predictions</p>
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <label style={{ display: "block", cursor: "pointer" }}>
                  <input type="file" accept=".xlsx,.csv" onChange={handleUpload} style={{ display: "none" }} />
                  <div style={{ border: `2px dashed ${theme.borderStrong}`, borderRadius: 16, padding: "32px 20px", textAlign: "center", background: theme.primaryBg, transition: "all 0.2s" }}>
                    {uploadFile ? (
                      <div>
                        <FileSpreadsheet style={{ width: 36, height: 36, color: theme.primary, margin: "0 auto 8px" }} />
                        <p style={{ color: theme.heading, fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px" }}>{uploadFile.name}</p>
                        <p style={{ color: theme.textMuted, fontSize: "0.8rem", margin: 0 }}>{(uploadFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                      </div>
                    ) : (
                      <div>
                        <Upload style={{ width: 36, height: 36, color: theme.primaryLight, margin: "0 auto 8px" }} />
                        <p style={{ color: theme.text, fontWeight: 600, fontSize: "0.95rem", margin: "0 0 4px" }}>Click to select file</p>
                        <p style={{ color: theme.textMuted, fontSize: "0.8rem", margin: 0 }}>.xlsx or .csv · max 5 MB</p>
                      </div>
                    )}
                  </div>
                </label>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={handleAnalyze} disabled={uploading || !uploadFile} style={{ flex: 1, background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, border: "none", borderRadius: 12, padding: "12px", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: uploading || !uploadFile ? "not-allowed" : "pointer", opacity: !uploadFile ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 4px 14px ${theme.primaryGlow}` }}>
                    {uploading ? (
                      <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} /> Analyzing…</>
                    ) : (
                      <><Zap style={{ width: 16, height: 16 }} /> Upload & Analyze</>
                    )}
                  </button>
                  {resultBlob && (
                    <button onClick={handleDownloadResults} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 18px", color: "#065f46", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      <Download style={{ width: 15, height: 15 }} /> Download Results (.xlsx)
                    </button>
                  )}
                </div>
              </div>

              {/* Required columns */}
              <div style={{ marginTop: 20 }}>
                <p style={{ color: theme.textMuted, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>REQUIRED COLUMNS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["roll_no", "age", "height_cm", "weight_kg", "hemoglobin", "tiredness", "weakness", "pale_skin", "dizziness", "breathless", "hair_fall", "headache", "cold_hand", "pica", "chest_pain", "palpitations"].map(c => (
                    <span key={c} style={{ background: theme.primaryBg, border: `1px solid ${theme.border}`, borderRadius: 6, padding: "3px 9px", fontSize: "0.72rem", color: theme.primary, fontWeight: 600 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Results table */}
            {showResults && predictionRows.length > 0 && (
              <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h3 style={{ color: theme.heading, fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>Prediction Results</h3>
                    <span style={{ background: theme.primaryBg, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "3px 12px", fontSize: "0.75rem", color: theme.primary, fontWeight: 700 }}>{predictionRows.length} records</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleDownloadResults} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "7px 14px", color: "#065f46", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                      <Download style={{ width: 14, height: 14 }} /> Download
                    </button>
                    <button onClick={() => setShowResults(false)} style={{ background: theme.primaryBg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 8, cursor: "pointer", color: theme.primary }}>
                      <X style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>

                {/* Summary pills */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {[
                    { label: "Total", count: predictionRows.length, bg: theme.primaryBg, color: theme.primary, bd: theme.border },
                    { label: "✅ Safe", count: safeCnt, bg: "rgba(16,185,129,0.08)", color: "#059669", bd: "rgba(16,185,129,0.25)" },
                    { label: "🩸 Anemia", count: anemiaCnt, bg: "rgba(244,63,94,0.08)", color: "#be123c", bd: "rgba(244,63,94,0.25)" },
                    { label: "⚠️ PCOD", count: pcodCnt, bg: "rgba(245,158,11,0.08)", color: "#92400e", bd: "rgba(245,158,11,0.25)" },
                  ].map(p => (
                    <div key={p.label} style={{ background: p.bg, border: `1px solid ${p.bd}`, borderRadius: 10, padding: "6px 14px", display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ color: p.color, fontSize: "0.8rem", fontWeight: 600 }}>{p.label}</span>
                      <span style={{ color: p.color, fontSize: "0.9rem", fontWeight: 800 }}>{p.count}</span>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                    <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: theme.textMuted }} />
                    <input
                      placeholder="Search roll number…"
                      value={filterText}
                      onChange={e => setFilterText(e.target.value)}
                      style={{ width: "100%", paddingLeft: 34, paddingRight: 16, paddingTop: 9, paddingBottom: 9, borderRadius: 12, fontSize: "0.85rem", color: theme.heading, background: theme.inputBg, border: `1px solid ${theme.border}`, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["all", "Safe", "Anemia", "PCOD"] as const).map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)} style={{
                        padding: "8px 14px", borderRadius: 10, fontSize: "0.78rem", fontWeight: 700, border: "none", cursor: "pointer",
                        ...(filterStatus === s
                          ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white" }
                          : { background: theme.primaryBg, border: `1px solid ${theme.border}`, color: theme.text })
                      }}>
                        {s === "all" ? "All" : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${theme.border}` }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "rgba(233,30,140,0.05)" }}>
                        {[
                          { key: "roll_no", label: "Roll No" },
                          { key: "age", label: "Age" },
                          { key: "bmi", label: "BMI" },
                          { key: "hemoglobin", label: "Hgb (g/dL)" },
                          { key: "prediction", label: "Diagnosis" },
                          { key: "confidence", label: "Confidence" },
                          { key: "isSafe", label: "Safe Status" },
                        ].map(({ key, label }) => (
                          <th key={key} onClick={() => handleSort(key as SortKey)} style={{ textAlign: "left", padding: "12px 16px", cursor: "pointer", color: theme.textMuted, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", userSelect: "none", borderBottom: `1px solid ${theme.border}` }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              {label}
                              {sortKey === key ? (sortDir === "asc" ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />) : null}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: "center", padding: "32px", color: theme.textMuted, fontSize: "0.875rem" }}>No records match your filter.</td></tr>
                      ) : filteredRows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(233,30,140,0.02)", borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ padding: "12px 16px", color: theme.heading, fontWeight: 600, fontSize: "0.85rem" }}>{row.roll_no}</td>
                          <td style={{ padding: "12px 16px", color: theme.text, fontSize: "0.85rem" }}>{row.age}</td>
                          <td style={{ padding: "12px 16px", color: theme.text, fontSize: "0.85rem" }}>{row.bmi}</td>
                          <td style={{ padding: "12px 16px", color: theme.text, fontSize: "0.85rem" }}>{row.hemoglobin}</td>
                          <td style={{ padding: "12px 16px" }}><PredictionBadge value={row.prediction} /></td>
                          <td style={{ padding: "12px 16px" }}>
                            {row.confidence !== "" ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{ flex: 1, height: 5, background: "rgba(233,30,140,0.12)", borderRadius: 3, overflow: "hidden", minWidth: 60 }}>
                                  <div style={{ height: "100%", width: `${Number(row.confidence)}%`, background: `linear-gradient(90deg, ${theme.primaryLight}, ${theme.primary})`, borderRadius: 3 }} />
                                </div>
                                <span style={{ color: theme.text, fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>{row.confidence}%</span>
                              </div>
                            ) : "—"}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {row.isSafe ? (
                              <span style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "3px 10px", color: "#059669", fontSize: "0.75rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle style={{ width: 11, height: 11 }} /> Safe
                              </span>
                            ) : (
                              <span style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: 20, padding: "3px 10px", color: "#be123c", fontSize: "0.75rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <AlertCircle style={{ width: 11, height: 11 }} /> Not Safe
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ color: theme.textMuted, fontSize: "0.75rem", marginTop: 10, textAlign: "right" }}>
                  Showing {filteredRows.length} of {predictionRows.length} records
                </p>
              </div>
            )}
          </div>
        )}

        {/* ════ LIVE ACTIVITY ════ */}
        {activeTab === "activity" && (
          <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ color: theme.heading, fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>Live Activity Feed</h2>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: theme.textMuted, fontSize: "0.75rem", fontWeight: 600 }}>
                <Clock style={{ width: 13, height: 13 }} /> Refreshes every 10s
              </span>
            </div>
            {stats?.recentActivity?.length ? stats.recentActivity.map(activity => {
              const aid = `${activity.type}-${activity.id}`;
              const isNew = newActivityIds.has(aid);
              return (
                <div key={aid} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "14px 0", borderBottom: `1px solid ${theme.border}`,
                  background: isNew ? "rgba(233,30,140,0.04)" : "transparent",
                  borderRadius: isNew ? 10 : 0,
                  paddingLeft: isNew ? 10 : 0,
                  transition: "all 0.5s"
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.primaryBg, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {activity.type === "anemia" ? <Activity style={{ width: 16, height: 16, color: "#f43f5e" }} /> : activity.type === "pcod" ? <Heart style={{ width: 16, height: 16, color: theme.primary }} /> : <Zap style={{ width: 16, height: 16, color: "#a855f7" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                      <span style={{ color: theme.heading, fontWeight: 700, fontSize: "0.875rem" }}>{activity.userName}</span>
                      {isNew && <span style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white", borderRadius: 20, fontSize: "0.6rem", fontWeight: 800, padding: "2px 8px" }}>NEW</span>}
                    </div>
                    <p style={{ color: ["Anemia", "High", "Critical"].some(k => activity.result?.includes(k)) ? "#be123c" : "#059669", fontSize: "0.8rem", margin: "0 0 4px", fontWeight: 600 }}>
                      {activity.type.toUpperCase()} — {activity.result}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {activity.verified
                        ? <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#059669", fontSize: "0.72rem", fontWeight: 700 }}><ShieldCheck style={{ width: 12, height: 12 }} /> Verified</span>
                        : <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#92400e", fontSize: "0.72rem", fontWeight: 700 }}><ShieldAlert style={{ width: 12, height: 12 }} /> Unverified</span>
                      }
                      <span style={{ color: theme.textMuted, fontSize: "0.72rem" }}>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: "center", padding: "48px 0", color: theme.textMuted }}>
                <Activity style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>No activity for this period.</p>
              </div>
            )}
          </div>
        )}

        {/* ════ ANALYTICS ════ */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
                <h3 style={{ color: theme.heading, fontWeight: 700, fontSize: "1rem", marginBottom: 20 }}>Check Distribution</h3>
                {[
                  { label: "Anemia Checks", value: stats?.anemiaChecks ?? 0, color: "#f43f5e" },
                  { label: "PCOD Checks", value: stats?.pcodChecks ?? 0, color: theme.primary },
                  { label: "Combined", value: stats?.combinedChecks ?? 0, color: "#c084fc" },
                ].map(item => {
                  const total = (stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0) + (stats?.combinedChecks ?? 0) || 1;
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: theme.text, fontSize: "0.85rem", fontWeight: 600 }}>{item.label}</span>
                        <span style={{ color: theme.heading, fontWeight: 700, fontSize: "0.85rem" }}>{item.value} ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: "rgba(233,30,140,0.1)", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: item.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
                <h3 style={{ color: theme.heading, fontWeight: 700, fontSize: "1rem", marginBottom: 20 }}>Risk Breakdown</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "High Risk · Anemia", value: stats?.clusterStats.anemiaHighRisk ?? 0, color: "#ef4444" },
                    { label: "Medium Risk · Anemia", value: stats?.clusterStats.anemiaMediumRisk ?? 0, color: "#f97316" },
                    { label: "Low Risk · Anemia", value: stats?.clusterStats.anemiaLowRisk ?? 0, color: "#22c55e" },
                    { label: "High Risk · PCOD", value: stats?.clusterStats.pcodHighRisk ?? 0, color: theme.primary },
                    { label: "Medium Risk · PCOD", value: stats?.clusterStats.pcodMediumRisk ?? 0, color: "#f59e0b" },
                    { label: "Low Risk · PCOD", value: stats?.clusterStats.pcodLowRisk ?? 0, color: "#10b981" },
                  ].map(item => (
                    <div key={item.label} style={{ background: `${item.color}10`, border: `1px solid ${item.color}30`, borderRadius: 12, padding: "10px 14px" }}>
                      <p style={{ color: `${item.color}`, fontSize: "0.7rem", fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                      <p style={{ color: theme.heading, fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
              {[
                { label: "Total Checks", value: (stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0) + (stats?.combinedChecks ?? 0) },
                { label: "Avg / Day", value: timeFilter === "week" ? Math.round(((stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0)) / 7) : "—" },
                { label: "Verified", value: stats?.blockchainRecords ?? 0 },
                { label: "Registered", value: stats?.totalUsers ?? 0 },
              ].map(s => (
                <div key={s.label} style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "18px 20px", textAlign: "center", boxShadow: theme.shadow }}>
                  <p style={{ color: theme.heading, fontSize: "1.8rem", fontWeight: 800, margin: "0 0 4px" }}>{s.value}</p>
                  <p style={{ color: theme.textMuted, fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ ALERTS ════ */}
        {activeTab === "alerts" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
              <h2 style={{ color: theme.heading, fontWeight: 800, fontSize: "1.1rem", marginBottom: 20 }}>Health Alerts</h2>
              {alertCnt === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CheckCircle style={{ width: 48, height: 48, color: "#10b981", margin: "0 auto 12px" }} />
                  <h3 style={{ color: "#059669", fontWeight: 800, margin: "0 0 6px" }}>All Clear!</h3>
                  <p style={{ color: theme.textMuted, fontSize: "0.85rem", margin: 0 }}>No critical alerts for this period.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {(stats?.clusterStats.anemiaHighRisk ?? 0) > 0 && <AlertCard theme={theme} level="critical" title="High-Risk Anemia Cases" message={`${stats?.clusterStats.anemiaHighRisk} students flagged with high-risk anemia requiring immediate attention.`} />}
                  {(stats?.clusterStats.pcodHighRisk ?? 0) > 0 && <AlertCard theme={theme} level="critical" title="High-Risk PCOD Cases" message={`${stats?.clusterStats.pcodHighRisk} students flagged with high-risk PCOD requiring immediate attention.`} />}
                  {(stats?.clusterStats.anemiaMediumRisk ?? 0) > 0 && <AlertCard theme={theme} level="warning" title="Medium-Risk Anemia Cases" message={`${stats?.clusterStats.anemiaMediumRisk} students with medium-risk anemia. Monitor and follow up.`} />}
                  {(stats?.clusterStats.pcodMediumRisk ?? 0) > 0 && <AlertCard theme={theme} level="warning" title="Medium-Risk PCOD Cases" message={`${stats?.clusterStats.pcodMediumRisk} students with medium-risk PCOD. Monitor and follow up.`} />}
                </div>
              )}
            </div>

            <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 24, boxShadow: theme.shadow }}>
              <h3 style={{ color: theme.heading, fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>System Status</h3>
              {[
                { label: "ML Model", status: "Operational", ok: true },
                { label: "Database", status: "Connected", ok: true },
                { label: "Blockchain", status: stats?.blockchainRecords ? "Active" : "Idle", ok: true },
                { label: "Live Data Feed", status: isLive ? "Running" : "Paused", ok: isLive },
              ].map((item, idx, arr) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: idx < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                  <span style={{ color: theme.text, fontSize: "0.875rem", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, background: item.ok ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", border: `1px solid ${item.ok ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`, borderRadius: 20, padding: "4px 12px", color: item.ok ? "#059669" : "#be123c", fontSize: "0.75rem", fontWeight: 700 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.ok ? "#10b981" : "#ef4444" }} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const KpiCard: React.FC<{ theme: any; icon: React.ReactNode; value: number; label: string; sub: string; color: string }> = ({ theme, icon, value, label, sub, color }) => (
  <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "22px 24px", boxShadow: theme.shadow, display: "flex", alignItems: "flex-start", gap: 16 }}>
    <div style={{ width: 44, height: 44, borderRadius: 13, background: `${color}14`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {React.cloneElement(icon as React.ReactElement, { style: { width: 20, height: 20, color } })}
    </div>
    <div>
      <p style={{ color: theme.heading, fontSize: "1.85rem", fontWeight: 800, lineHeight: 1, margin: "0 0 4px" }}>{value.toLocaleString()}</p>
      <p style={{ color: theme.text, fontSize: "0.875rem", fontWeight: 700, margin: "0 0 2px" }}>{label}</p>
      <p style={{ color: theme.textMuted, fontSize: "0.75rem", margin: 0 }}>{sub}</p>
    </div>
  </div>
);

const RiskPanel: React.FC<{ theme: any; title: string; icon: React.ReactNode; high: number; medium: number; low: number }> = ({ theme, title, icon, high, medium, low }) => {
  const total = high + medium + low || 1;
  return (
    <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 22, boxShadow: theme.shadow }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {React.cloneElement(icon as React.ReactElement, { style: { width: 16, height: 16, color: theme.primary } })}
        <span style={{ color: theme.heading, fontWeight: 700, fontSize: "0.9rem" }}>{title}</span>
      </div>
      {[
        { label: "High Risk", value: high, color: "#ef4444" },
        { label: "Medium Risk", value: medium, color: "#f97316" },
        { label: "Low Risk", value: low, color: "#22c55e" },
      ].map(r => (
        <div key={r.label} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ color: theme.text, fontSize: "0.8rem", fontWeight: 600 }}>{r.label}</span>
            <span style={{ color: theme.heading, fontWeight: 700, fontSize: "0.8rem" }}>{r.value}</span>
          </div>
          <div style={{ height: 7, background: "rgba(233,30,140,0.1)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(r.value / total) * 100}%`, background: r.color, borderRadius: 4, transition: "width 0.8s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickStat: React.FC<{ theme: any; label: string; value: number; icon: React.ReactNode; color: string }> = ({ theme, label, value, icon, color }) => (
  <div style={{ background: theme.cardSolid, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: theme.shadow }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {React.cloneElement(icon as React.ReactElement, { style: { width: 18, height: 18, color } })}
    </div>
    <div>
      <p style={{ color: theme.heading, fontSize: "1.3rem", fontWeight: 800, margin: "0 0 2px" }}>{value.toLocaleString()}</p>
      <p style={{ color: theme.textMuted, fontSize: "0.75rem", fontWeight: 600, margin: 0 }}>{label}</p>
    </div>
  </div>
);

const PredictionBadge: React.FC<{ value: string }> = ({ value }) => {
  const s = value === "Safe"
    ? { bg: "rgba(16,185,129,0.1)", color: "#059669", bd: "rgba(16,185,129,0.3)" }
    : value === "Anemia"
    ? { bg: "rgba(244,63,94,0.1)", color: "#be123c", bd: "rgba(244,63,94,0.3)" }
    : value === "PCOD"
    ? { bg: "rgba(245,158,11,0.1)", color: "#92400e", bd: "rgba(245,158,11,0.3)" }
    : { bg: "rgba(233,30,140,0.06)", color: "#c2185b", bd: "rgba(233,30,140,0.2)" };
  return <span style={{ background: s.bg, border: `1px solid ${s.bd}`, borderRadius: 20, padding: "3px 10px", color: s.color, fontSize: "0.75rem", fontWeight: 700 }}>{value || "—"}</span>;
};

const AlertCard: React.FC<{ theme: any; level: "critical" | "warning"; title: string; message: string }> = ({ theme, level, title, message }) => (
  <div style={{ background: level === "critical" ? "rgba(244,63,94,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${level === "critical" ? "rgba(244,63,94,0.25)" : "rgba(245,158,11,0.25)"}`, borderRadius: 14, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
    {level === "critical"
      ? <AlertCircle style={{ width: 20, height: 20, color: "#ef4444", flexShrink: 0, marginTop: 1 }} />
      : <AlertTriangle style={{ width: 20, height: 20, color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
    }
    <div>
      <p style={{ color: level === "critical" ? "#be123c" : "#92400e", fontWeight: 700, fontSize: "0.875rem", margin: "0 0 4px" }}>{title}</p>
      <p style={{ color: level === "critical" ? "#9f1239" : "#78350f", fontSize: "0.8rem", margin: 0 }}>{message}</p>
    </div>
  </div>
);

export default AdminDashboard;
