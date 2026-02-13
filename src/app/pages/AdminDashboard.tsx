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
  anemiaHighRisk: number; anemiaMediumRisk: number; anemiaLowRisk: number;
  pcodHighRisk: number; pcodMediumRisk: number; pcodLowRisk: number;
}
interface DashboardStats {
  totalUsers: number; anemiaChecks: number; pcodChecks: number;
  combinedChecks: number; blockchainRecords: number;
  recentActivity: ActivityItem[]; clusterStats: ClusterStats;
}
interface PredictionRow {
  roll_no: string; age: number | string; bmi: number | string;
  hemoglobin: number | string; prediction: string;
  confidence: number | string; status: string; isSafe: boolean;
}
type SortKey = keyof PredictionRow;
type SortDir = "asc" | "desc";
type TabId = "overview" | "bulk" | "activity" | "analytics" | "alerts";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview",  label: "Overview",      icon: <BarChart3 className="w-4 h-4" /> },
  { id: "bulk",      label: "Bulk Analysis", icon: <Upload className="w-4 h-4" /> },
  { id: "activity",  label: "Live Activity", icon: <Radio className="w-4 h-4" /> },
  { id: "analytics", label: "Analytics",     icon: <TrendingUp className="w-4 h-4" /> },
  { id: "alerts",    label: "Alerts",        icon: <Bell className="w-4 h-4" /> },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  window.URL.revokeObjectURL(url); document.body.removeChild(a);
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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
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
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData,
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
      setFilterText(""); setFilterStatus("all"); setSortKey("roll_no"); setSortDir("asc");
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
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

  const safeCnt = predictionRows.filter(r => r.prediction === "Safe").length;
  const anemiaCnt = predictionRows.filter(r => r.prediction === "Anemia").length;
  const pcodCnt = predictionRows.filter(r => r.prediction === "PCOD").length;
  const alertCnt = anemiaCnt + pcodCnt;

  // ── CSS-in-JS theme tokens ────────────────────────────────────────────────
  const theme = {
    bg: "linear-gradient(135deg, #1a0814 0%, #2e0a28 45%, #1a0818 100%)",
    card: "rgba(255,255,255,0.04)",
    border: "rgba(255,160,200,0.12)",
    primary: "#e91e8c",
    primaryDark: "#c2185b",
    primaryGlow: "rgba(233,30,140,0.35)",
    text: "rgba(255,190,220,0.6)",
    textMuted: "rgba(255,180,210,0.35)",
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full animate-spin mx-auto mb-4"
          style={{ border: "4px solid rgba(255,150,180,0.15)", borderTopColor: theme.primary }} />
        <p className="font-medium tracking-wide" style={{ color: "#fbcfe8" }}>Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
      <div className="rounded-2xl p-8 max-w-md text-center" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
        <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: theme.primary }} />
        <p className="text-white font-semibold mb-2">Error</p>
        <p className="text-sm mb-6" style={{ color: "#fbcfe8" }}>{error}</p>
        <button onClick={() => loadDashboardData()} className="w-full py-2.5 rounded-xl text-white font-bold mb-3"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}>Retry</button>
        <button onClick={() => navigate("/admin-login")} className="w-full py-2.5 rounded-xl font-medium"
          style={{ background: "rgba(255,255,255,0.08)", color: "#fbcfe8" }}>Back to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: theme.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #e91e8c, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #ff6eb0, transparent 70%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, boxShadow: `0 6px 20px ${theme.primaryGlow}` }}>
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Women's Health Admin</h1>
              <p className="text-xs" style={{ color: theme.textMuted }}>
                Last synced {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.28)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ec4899" }} />
                <span className="text-xs font-semibold" style={{ color: "#f9a8d4" }}>Live</span>
              </div>
            )}
            <button onClick={() => loadDashboardData()} title="Refresh"
              className="p-2 rounded-xl transition-all hover:scale-105"
              style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <RefreshCw className="w-4 h-4" style={{ color: "#f9a8d4" }} />
            </button>
            <button onClick={handleDownloadReport} disabled={downloadingReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, boxShadow: `0 4px 18px ${theme.primaryGlow}` }}>
              <Download className="w-4 h-4" />
              {downloadingReport ? "Exporting…" : "Export Report"}
            </button>
          </div>
        </div>

        {/* ── Success banner ── */}
        {successMessage && (
          <div className="rounded-xl p-3.5 flex items-center gap-3"
            style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.28)" }}>
            <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#f472b6" }} />
            <span className="text-sm font-medium" style={{ color: "#fbcfe8" }}>{successMessage}</span>
          </div>
        )}

        {/* ── Navigation Tabs ── */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${theme.border}` }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all relative"
              style={activeTab === tab.id
                ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white", boxShadow: `0 4px 14px ${theme.primaryGlow}` }
                : { color: theme.text }}>
              {tab.icon}{tab.label}
              {tab.id === "alerts" && alertCnt > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "#dc2626" }}>{alertCnt > 9 ? "9+" : alertCnt}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Time Filter (overview + analytics) ── */}
        {(activeTab === "overview" || activeTab === "analytics") && (
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <Filter className="w-4 h-4" style={{ color: "#f9a8d4" }} />
            <span className="text-sm font-medium" style={{ color: theme.text }}>Period:</span>
            {(["today","week","month","all"] as const).map(p => (
              <button key={p} onClick={() => setTimeFilter(p)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={timeFilter === p
                  ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white" }
                  : { background: "rgba(255,255,255,0.07)", color: theme.text }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard icon={<Users />} value={stats?.totalUsers ?? 0} label="Total Users" sub="All time" color={theme.primary} />
              <KpiCard icon={<Activity />} value={stats?.anemiaChecks ?? 0} label="Anemia Checks" sub={`This ${timeFilter}`} color="#f43f5e" />
              <KpiCard icon={<TrendingUp />} value={stats?.pcodChecks ?? 0} label="PCOD Checks" sub={`This ${timeFilter}`} color="#ec4899" />
              <KpiCard icon={<Database />} value={stats?.combinedChecks ?? 0} label="Combined" sub={`This ${timeFilter}`} color="#db2777" />
            </div>
            {stats?.clusterStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RiskPanel title="Anemia Risk" icon={<Activity />} high={stats.clusterStats.anemiaHighRisk} medium={stats.clusterStats.anemiaMediumRisk} low={stats.clusterStats.anemiaLowRisk} />
                <RiskPanel title="PCOD Risk" icon={<TrendingUp />} high={stats.clusterStats.pcodHighRisk} medium={stats.clusterStats.pcodMediumRisk} low={stats.clusterStats.pcodLowRisk} />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickStat label="High Risk Users" value={(stats?.clusterStats.anemiaHighRisk ?? 0) + (stats?.clusterStats.pcodHighRisk ?? 0)} icon={<AlertTriangle />} color="#ef4444" />
              <QuickStat label="Blockchain Verified" value={stats?.blockchainRecords ?? 0} icon={<ShieldCheck />} color="#a855f7" />
              <QuickStat label="Healthy Users" value={Math.max(0, (stats?.totalUsers ?? 0) - (stats?.clusterStats.anemiaHighRisk ?? 0) - (stats?.clusterStats.pcodHighRisk ?? 0))} icon={<UserCheck />} color="#10b981" />
            </div>
          </div>
        )}

        {/* ════ BULK ANALYSIS ════ */}
        {activeTab === "bulk" && (
          <div className="space-y-5">
            {/* Upload card */}
            <div className="rounded-2xl p-6" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(233,30,140,0.12)", border: "1px solid rgba(233,30,140,0.25)" }}>
                  <Zap className="w-5 h-5" style={{ color: "#f9a8d4" }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Bulk ML Health Analysis</h2>
                  <p className="text-xs" style={{ color: theme.textMuted }}>Upload student data for instant AI predictions</p>
                </div>
              </div>

              {/* Drop zone */}
              <label className="block cursor-pointer mb-5">
                <div className="rounded-2xl p-8 text-center transition-all"
                  style={{ border: `2px dashed ${uploadFile ? "rgba(233,30,140,0.5)" : "rgba(255,160,200,0.15)"}`, background: uploadFile ? "rgba(233,30,140,0.04)" : "rgba(255,255,255,0.01)" }}>
                  {uploadFile ? (
                    <div className="space-y-1.5">
                      <FileSpreadsheet className="w-10 h-10 mx-auto" style={{ color: "#f9a8d4" }} />
                      <p className="font-bold text-white">{uploadFile.name}</p>
                      <p className="text-xs" style={{ color: theme.textMuted }}>{(uploadFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Upload className="w-10 h-10 mx-auto" style={{ color: "rgba(255,160,200,0.25)" }} />
                      <p className="font-medium" style={{ color: theme.text }}>Click to select file</p>
                      <p className="text-xs" style={{ color: theme.textMuted }}>.xlsx or .csv · max 5 MB</p>
                    </div>
                  )}
                </div>
                <input type="file" accept=".xlsx,.csv" onChange={handleUpload} className="hidden" />
              </label>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleAnalyze} disabled={uploading || !uploadFile}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, boxShadow: `0 4px 18px ${theme.primaryGlow}` }}>
                  {uploading
                    ? <><div className="w-4 h-4 rounded-full animate-spin" style={{ border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "white" }} />Analyzing…</>
                    : <><Zap className="w-4 h-4" />Upload & Analyze</>}
                </button>

                {resultBlob && (
                  <button onClick={handleDownloadResults}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${theme.border}`, color: "#fbcfe8" }}>
                    <Download className="w-4 h-4" />Download Results (.xlsx)
                  </button>
                )}
              </div>

              {/* Required columns */}
              <div className="mt-5 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${theme.border}` }}>
                <p className="text-xs font-bold mb-2" style={{ color: theme.textMuted }}>REQUIRED COLUMNS</p>
                <div className="flex flex-wrap gap-1.5">
                  {["roll_no","age","height_cm","weight_kg","hemoglobin","tiredness","weakness","pale_skin","dizziness","breathless","hair_fall","headache","cold_hand","pica","chest_pain","palpitations"].map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md text-xs font-mono"
                      style={{ background: "rgba(233,30,140,0.1)", color: "#f9a8d4", border: "1px solid rgba(233,30,140,0.2)" }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Results table */}
            {showResults && predictionRows.length > 0 && (
              <div className="rounded-2xl p-6 space-y-5" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">Prediction Results</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                      style={{ background: "rgba(233,30,140,0.15)", color: "#f9a8d4", border: "1px solid rgba(233,30,140,0.3)" }}>
                      {predictionRows.length} records
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleDownloadResults} disabled={!resultBlob}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white" }}>
                      <Download className="w-3.5 h-3.5" />Download
                    </button>
                    <button onClick={() => setShowResults(false)} className="p-2 rounded-xl transition-all"
                      style={{ background: "rgba(255,255,255,0.07)" }}>
                      <X className="w-4 h-4" style={{ color: theme.text }} />
                    </button>
                  </div>
                </div>

                {/* Summary pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Total",      count: predictionRows.length, bg: "rgba(255,255,255,0.07)", color: "white", bd: "rgba(255,255,255,0.12)" },
                    { label: "✅ Safe",    count: safeCnt,   bg: "rgba(16,185,129,0.1)", color: "#6ee7b7", bd: "rgba(16,185,129,0.25)" },
                    { label: "🩸 Anemia", count: anemiaCnt, bg: "rgba(244,63,94,0.1)",  color: "#fda4af", bd: "rgba(244,63,94,0.25)" },
                    { label: "⚠️ PCOD",   count: pcodCnt,   bg: "rgba(245,158,11,0.1)", color: "#fcd34d", bd: "rgba(245,158,11,0.25)" },
                  ].map(p => (
                    <div key={p.label} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                      style={{ background: p.bg, color: p.color, border: `1px solid ${p.bd}` }}>
                      <span>{p.label}</span><span>{p.count}</span>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.textMuted }} />
                    <input type="text" placeholder="Search by Roll No…" value={filterText} onChange={e => setFilterText(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                      style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }} />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(["all","Safe","Anemia","PCOD"] as const).map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        style={filterStatus === s
                          ? { background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, color: "white" }
                          : { background: "rgba(255,255,255,0.07)", color: theme.text }}>
                        {s === "all" ? "All" : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${theme.border}` }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${theme.border}` }}>
                        {[
                          { key:"roll_no", label:"Roll No" }, { key:"age", label:"Age" },
                          { key:"bmi", label:"BMI" }, { key:"hemoglobin", label:"Hgb (g/dL)" },
                          { key:"prediction", label:"Diagnosis" }, { key:"confidence", label:"Confidence" },
                          { key:"isSafe", label:"Safe Status" },
                        ].map(({ key, label }) => (
                          <th key={key} onClick={() => handleSort(key as SortKey)}
                            className="text-left px-4 py-3 cursor-pointer select-none transition-colors"
                            style={{ color: theme.textMuted, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                            <span className="flex items-center gap-1">
                              {label}
                              {sortKey === key
                                ? sortDir === "asc" ? <ChevronUp className="w-3 h-3" style={{ color: "#f9a8d4" }} /> : <ChevronDown className="w-3 h-3" style={{ color: "#f9a8d4" }} />
                                : <ChevronUp className="w-3 h-3 opacity-20" />}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-12" style={{ color: theme.textMuted }}>No records match your filter.</td></tr>
                      ) : filteredRows.map((row, i) => (
                        <tr key={`${row.roll_no}-${i}`} style={{ borderBottom: `1px solid rgba(255,160,200,0.04)` }}
                          className="transition-colors hover:bg-[rgba(233,30,140,0.05)]">
                          <td className="px-4 py-3 font-mono font-bold text-white">{row.roll_no}</td>
                          <td className="px-4 py-3" style={{ color: "rgba(255,200,220,0.7)" }}>{row.age}</td>
                          <td className="px-4 py-3" style={{ color: "rgba(255,200,220,0.7)" }}>{row.bmi}</td>
                          <td className="px-4 py-3" style={{ color: "rgba(255,200,220,0.7)" }}>{row.hemoglobin}</td>
                          <td className="px-4 py-3"><PredictionBadge value={row.prediction} /></td>
                          <td className="px-4 py-3">
                            {row.confidence !== "" ? (
                              <div className="flex items-center gap-2">
                                <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                                  <div className="h-full rounded-full" style={{ width: `${row.confidence}%`, background: `linear-gradient(90deg, ${theme.primary}, #f9a8d4)` }} />
                                </div>
                                <span className="text-xs" style={{ color: theme.text }}>{row.confidence}%</span>
                              </div>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.isSafe ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                style={{ background: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.28)" }}>
                                <ShieldCheck className="w-3 h-3" />Safe
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.28)" }}>
                                <ShieldAlert className="w-3 h-3" />Not Safe
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs" style={{ color: theme.textMuted }}>
                  Showing {filteredRows.length} of {predictionRows.length} records
                </p>
              </div>
            )}
          </div>
        )}

        {/* ════ LIVE ACTIVITY ════ */}
        {activeTab === "activity" && (
          <div className="rounded-2xl p-6 space-y-4" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5" style={{ color: "#f9a8d4" }} />Live Activity Feed
              </h2>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#86efac" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
                Refreshes every 10s
              </span>
            </div>
            <div className="space-y-2">
              {stats?.recentActivity?.length ? stats.recentActivity.map(activity => {
                const aid = `${activity.type}-${activity.id}`;
                const isNew = newActivityIds.has(aid);
                return (
                  <div key={aid} className="flex items-center justify-between p-4 rounded-xl transition-all"
                    style={{ background: isNew ? "rgba(233,30,140,0.07)" : "rgba(255,255,255,0.025)", border: `1px solid ${isNew ? "rgba(233,30,140,0.28)" : "rgba(255,160,200,0.05)"}` }}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl"
                        style={{ background: activity.type === "anemia" ? "rgba(244,63,94,0.15)" : activity.type === "pcod" ? "rgba(236,72,153,0.15)" : "rgba(168,85,247,0.15)" }}>
                        {activity.type === "anemia" ? <Activity className="w-4 h-4" style={{ color: "#fb7185" }} />
                          : activity.type === "pcod" ? <TrendingUp className="w-4 h-4" style={{ color: "#f472b6" }} />
                          : <Database className="w-4 h-4" style={{ color: "#c084fc" }} />}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm flex items-center gap-2">
                          {activity.userName}
                          {isNew && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: theme.primary, color: "white" }}>NEW</span>}
                        </p>
                        <p className="text-xs" style={{ color: theme.textMuted }}>
                          {activity.type.toUpperCase()} —{" "}
                          <span style={{ color: ["High","Anemia","PCOD","Critical"].some(k => activity.result?.includes(k)) ? "#fda4af" : "#86efac" }}>
                            {activity.result}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {activity.verified
                        ? <CheckCircle className="w-4 h-4" style={{ color: "#4ade80" }} title="Verified" />
                        : <Clock className="w-4 h-4" style={{ color: "#fbbf24" }} title="Pending" />}
                      <span className="text-xs" style={{ color: theme.textMuted }}>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-16">
                  <Eye className="w-10 h-10 mx-auto mb-3" style={{ color: theme.textMuted }} />
                  <p className="text-sm" style={{ color: theme.textMuted }}>No activity for this period.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ ANALYTICS ════ */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-6" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4" style={{ color: "#f9a8d4" }} />Check Distribution
                </h3>
                {[
                  { label: "Anemia Checks", value: stats?.anemiaChecks ?? 0, color: "#f43f5e" },
                  { label: "PCOD Checks",   value: stats?.pcodChecks ?? 0,   color: "#e91e8c" },
                  { label: "Combined",      value: stats?.combinedChecks ?? 0, color: "#c084fc" },
                ].map(item => {
                  const total = (stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0) + (stats?.combinedChecks ?? 0) || 1;
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label} className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: "rgba(255,200,220,0.7)" }}>{item.label}</span>
                        <span className="font-bold text-white">{item.value} <span style={{ color: theme.textMuted }}>({pct}%)</span></span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl p-6" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4" style={{ color: "#f9a8d4" }} />Risk Breakdown
                </h3>
                {[
                  { label: "High Risk · Anemia",   value: stats?.clusterStats.anemiaHighRisk ?? 0,   color: "#ef4444" },
                  { label: "Medium Risk · Anemia",  value: stats?.clusterStats.anemiaMediumRisk ?? 0,  color: "#f97316" },
                  { label: "Low Risk · Anemia",     value: stats?.clusterStats.anemiaLowRisk ?? 0,     color: "#22c55e" },
                  { label: "High Risk · PCOD",      value: stats?.clusterStats.pcodHighRisk ?? 0,      color: "#e91e8c" },
                  { label: "Medium Risk · PCOD",    value: stats?.clusterStats.pcodMediumRisk ?? 0,    color: "#f59e0b" },
                  { label: "Low Risk · PCOD",       value: stats?.clusterStats.pcodLowRisk ?? 0,       color: "#10b981" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="text-xs" style={{ color: "rgba(255,200,220,0.7)" }}>{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Checks",    value: (stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0) + (stats?.combinedChecks ?? 0) },
                { label: "Avg / Day",       value: timeFilter === "week" ? Math.round(((stats?.anemiaChecks ?? 0) + (stats?.pcodChecks ?? 0)) / 7) : "—" },
                { label: "Verified",        value: stats?.blockchainRecords ?? 0 },
                { label: "Registered",      value: stats?.totalUsers ?? 0 },
              ].map(s => (
                <div key={s.label} className="rounded-xl px-5 py-4 text-center"
                  style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs mt-1" style={{ color: theme.textMuted }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ ALERTS ════ */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: "#f9a8d4" }} />Health Alerts
              </h2>
              {alertCnt === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#4ade80" }} />
                  <p className="font-semibold text-white">All Clear!</p>
                  <p className="text-sm mt-1" style={{ color: theme.textMuted }}>No critical alerts for this period.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(stats?.clusterStats.anemiaHighRisk ?? 0) > 0 && <AlertCard level="critical" title="High-Risk Anemia Cases" message={`${stats!.clusterStats.anemiaHighRisk} users flagged with high-risk anemia. Immediate clinical review recommended.`} />}
                  {(stats?.clusterStats.pcodHighRisk ?? 0) > 0 && <AlertCard level="critical" title="High-Risk PCOD Cases" message={`${stats!.clusterStats.pcodHighRisk} users showing high-risk PCOD symptoms. Gynecological consultation advised.`} />}
                  {(stats?.clusterStats.anemiaMediumRisk ?? 0) > 0 && <AlertCard level="warning" title="Medium-Risk Anemia Cases" message={`${stats!.clusterStats.anemiaMediumRisk} users in medium-risk anemia category. Dietary follow-up suggested.`} />}
                  {(stats?.clusterStats.pcodMediumRisk ?? 0) > 0 && <AlertCard level="warning" title="Medium-Risk PCOD Cases" message={`${stats!.clusterStats.pcodMediumRisk} users with moderate PCOD risk. Lifestyle guidance recommended.`} />}
                </div>
              )}
            </div>

            <div className="rounded-2xl p-6" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "#f9a8d4" }} />System Status
              </h3>
              {[
                { label: "ML Model",          status: "Operational", ok: true },
                { label: "Database",          status: "Connected",   ok: true },
                { label: "Blockchain",        status: stats?.blockchainRecords ? "Active" : "Idle", ok: true },
                { label: "Live Data Feed",    status: isLive ? "Running" : "Paused", ok: isLive },
              ].map((item, idx, arr) => (
                <div key={item.label} className="flex items-center justify-between py-3"
                  style={{ borderBottom: idx < arr.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                  <span className="text-sm" style={{ color: "rgba(255,200,220,0.7)" }}>{item.label}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: item.ok ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)", color: item.ok ? "#86efac" : "#fca5a5", border: `1px solid ${item.ok ? "rgba(74,222,128,0.22)" : "rgba(239,68,68,0.22)"}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.ok ? "#4ade80" : "#ef4444" }} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const KpiCard: React.FC<{ icon: React.ReactNode; value: number; label: string; sub: string; color: string }> = ({ icon, value, label, sub, color }) => (
  <div className="rounded-2xl p-5 transition-all hover:scale-[1.03] cursor-default"
    style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)`, border: `1px solid ${color}28` }}>
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-xl" style={{ background: `${color}18` }}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5", style: { color } })}
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 opacity-40" style={{ color }} />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm font-medium mt-0.5" style={{ color: "rgba(255,220,235,0.85)" }}>{label}</p>
    <p className="text-xs mt-0.5" style={{ color: "rgba(255,180,210,0.35)" }}>{sub}</p>
  </div>
);

const RiskPanel: React.FC<{ title: string; icon: React.ReactNode; high: number; medium: number; low: number }> = ({ title, icon, high, medium, low }) => {
  const total = high + medium + low || 1;
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,160,200,0.1)" }}>
      <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
        {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4", style: { color: "#f9a8d4" } })} {title}
      </h3>
      {[
        { label: "High Risk", value: high, color: "#ef4444" },
        { label: "Medium Risk", value: medium, color: "#f97316" },
        { label: "Low Risk", value: low, color: "#22c55e" },
      ].map(r => (
        <div key={r.label} className="mb-3.5">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: "rgba(255,200,220,0.65)" }}>{r.label}</span>
            <span className="font-bold" style={{ color: r.color }}>{r.value}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(r.value / total) * 100}%`, background: r.color }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickStat: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,160,200,0.1)" }}>
    <div className="p-3 rounded-xl" style={{ background: `${color}14` }}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5", style: { color } })}
    </div>
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs" style={{ color: "rgba(255,180,210,0.45)" }}>{label}</p>
    </div>
  </div>
);

const PredictionBadge: React.FC<{ value: string }> = ({ value }) => {
  const s = value === "Safe"   ? { bg: "rgba(16,185,129,0.12)", color: "#6ee7b7", bd: "rgba(16,185,129,0.25)" }
    : value === "Anemia" ? { bg: "rgba(244,63,94,0.12)",  color: "#fda4af", bd: "rgba(244,63,94,0.25)" }
    : value === "PCOD"   ? { bg: "rgba(245,158,11,0.12)", color: "#fcd34d", bd: "rgba(245,158,11,0.25)" }
    :                      { bg: "rgba(255,255,255,0.05)", color: "rgba(255,180,210,0.4)", bd: "rgba(255,255,255,0.1)" };
  return <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: s.bg, color: s.color, border: `1px solid ${s.bd}` }}>{value || "—"}</span>;
};

const AlertCard: React.FC<{ level: "critical" | "warning"; title: string; message: string }> = ({ level, title, message }) => (
  <div className="flex gap-3 p-4 rounded-xl"
    style={{ background: level === "critical" ? "rgba(239,68,68,0.07)" : "rgba(245,158,11,0.07)", border: `1px solid ${level === "critical" ? "rgba(239,68,68,0.22)" : "rgba(245,158,11,0.22)"}` }}>
    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: level === "critical" ? "#f87171" : "#fbbf24" }} />
    <div>
      <p className="font-semibold text-white text-sm">{title}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(255,200,220,0.55)" }}>{message}</p>
    </div>
  </div>
);

export default AdminDashboard;
