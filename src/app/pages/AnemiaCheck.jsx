import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Globe } from "lucide-react";
import Logo from "../../assets/Logo.jpg";

/* ============================================================
   TRANSLATIONS
============================================================ */
const translations = {
  en: {
    title: "Advanced Anemia Detection",
    subtitle: "AI-powered severity-based assessment for early anaemia screening.",
    basicDetails: "Basic Health Details",
    height: "Height (cm)", weight: "Weight (kg)", hemoglobin: "Hemoglobin (g/dL)",
    age: "Age", bmi: "BMI", bmiAuto: "Auto from height & weight",
    riskFactors: "Risk factors",
    heavyPeriods: "Heavy menstrual bleeding",
    poorDiet: "Poor diet / iron-poor meals",
    symptoms: "Symptoms (severity sliders)",
    symptomsGuide: "🟣 Common · 🟡 Moderate · 🔴 Severe",
    analyzing: "Analyzing...", analyzeButton: "Analyze Anemia Risk",
    riskLevel: "Risk level", status: "Status", checkId: "Check ID",
    riskFactorsList: "Risk factors", recommendations: "Recommendations",
    downloadExcel: "Download Analysis Report (Excel)",
    downloadPDF: "Download Medical PDF",
    fillRequired: "Please fill all required fields",
    loginRequired: "Please log in to analyze. Redirecting...",
    backToDashboard: "Back to Dashboard",
    symptomLabels: {
      tiredness: "Constant Tiredness", weakness: "Weakness / Low Energy",
      paleskin: "Pale Skin / Lips", dizziness: "Dizziness / Light-headedness",
      breathlessness: "Breathlessness", hairfall: "Hair Fall / Thinning",
      headache: "Headache", coldextremities: "Cold Hands & Feet",
      pica: "Pica (Mud / Chalk / Ice Craving)", chestpain: "Chest Pain",
      palpitations: "Palpitations / Fast Heartbeat",
    },
  },
  te: {
    title: "అనీమియా అధునాతన పరీక్ష",
    subtitle: "ముందస్తు అనీమియా స్క్రీనింగ్ కోసం AI ఆధారిత తీవ్రత అంచనా.",
    basicDetails: "ప్రాథమిక ఆరోగ్య వివరాలు",
    height: "ఎత్తు (సెం.మీ)", weight: "బరువు (కిలోలు)", hemoglobin: "హిమోగ్లోబిన్ (g/dL)",
    age: "వయస్సు", bmi: "BMI", bmiAuto: "ఎత్తు & బరువు నుండి స్వయంచాలకంగా",
    riskFactors: "ప్రమాద కారకాలు",
    heavyPeriods: "అధిక రక్తస్రావం",
    poorDiet: "పేలవమైన ఆహారం / ఇనుము లేని భోజనం",
    symptoms: "లక్షణాలు (తీవ్రత స్లైడర్లు)",
    symptomsGuide: "🟣 సాధారణం · 🟡 మధ్యస్థం · 🔴 తీవ్రమైనది",
    analyzing: "విశ్లేషిస్తోంది...", analyzeButton: "అనీమియా ప్రమాదాన్ని విశ్లేషించండి",
    riskLevel: "ప్రమాద స్థాయి", status: "స్థితి", checkId: "తనిఖీ ID",
    riskFactorsList: "ప్రమాద కారకాలు", recommendations: "సిఫార్సులు",
    downloadExcel: "విశ్లేషణ నివేదికను డౌన్‌లోడ్ చేయండి (Excel)",
    downloadPDF: "వైద్య PDF డౌన్‌లోడ్ చేయండి",
    fillRequired: "దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి",
    loginRequired: "విశ్లేషించడానికి దయచేసి లాగిన్ అవ్వండి.",
    backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
    symptomLabels: {
      tiredness: "నిరంతర అలసట", weakness: "బలహీనత / తక్కువ శక్తి",
      paleskin: "లేత చర్మం / పెదవులు", dizziness: "తలతిరగడం / తేలికగా అనిపించడం",
      breathlessness: "ఊపిరి ఆడకపోవడం", hairfall: "జుట్టు రాలడం / సన్నబడటం",
      headache: "తలనొప్పి", coldextremities: "చల్లని చేతులు & కాళ్ళు",
      pica: "పైకా (మట్టి / సుద్ద / మంచు కోరిక)", chestpain: "ఛాతీ నొప్పి",
      palpitations: "గుండె వేగంగా కొట్టుకోవడం",
    },
  },
  hi: {
    title: "उन्नत एनीमिया जांच",
    subtitle: "प्रारंभिक एनीमिया स्क्रीनिंग के लिए AI आधारित गंभीरता मूल्यांकन।",
    basicDetails: "बुनियादी स्वास्थ्य विवरण",
    height: "ऊंचाई (सेमी)", weight: "वजन (किलो)", hemoglobin: "हीमोग्लोबिन (g/dL)",
    age: "आयु", bmi: "BMI", bmiAuto: "ऊंचाई और वजन से स्वतः",
    riskFactors: "जोखिम कारक",
    heavyPeriods: "अत्यधिक मासिक धर्म रक्तस्राव",
    poorDiet: "खराब आहार / आयरन की कमी वाला भोजन",
    symptoms: "लक्षण (गंभीरता स्लाइडर)",
    symptomsGuide: "🟣 सामान्य · 🟡 मध्यम · 🔴 गंभीर",
    analyzing: "विश्लेषण हो रहा है...", analyzeButton: "एनीमिया जोखिम का विश्लेषण करें",
    riskLevel: "जोखिम स्तर", status: "स्थिति", checkId: "जांच ID",
    riskFactorsList: "जोखिम कारक", recommendations: "सिफारिशें",
    downloadExcel: "विश्लेषण रिपोर्ट डाउनलोड करें (Excel)",
    downloadPDF: "चिकित्सा PDF डाउनलोड करें",
    fillRequired: "कृपया सभी आवश्यक फ़ील्ड भरें",
    loginRequired: "विश्लेषण के लिए कृपया लॉगिन करें।",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    symptomLabels: {
      tiredness: "लगातार थकान", weakness: "कमजोरी / कम ऊर्जा",
      paleskin: "पीली त्वचा / होंठ", dizziness: "चक्कर आना / हल्कापन महसूस होना",
      breathlessness: "सांस फूलना", hairfall: "बालों का झड़ना / पतला होना",
      headache: "सिरदर्द", coldextremities: "ठंडे हाथ और पैर",
      pica: "पाइका (मिट्टी / चाक / बर्फ की लालसा)", chestpain: "सीने में दर्द",
      palpitations: "धड़कन तेज होना",
    },
  },
};

/* ============================================================
   SYMPTOM LIST
============================================================ */
const symptomsList = [
  { id: "tiredness",      icon: "😴", group: "common"   },
  { id: "weakness",       icon: "💤", group: "common"   },
  { id: "paleskin",       icon: "😶", group: "common"   },
  { id: "dizziness",      icon: "🌀", group: "common"   },
  { id: "breathlessness", icon: "😮‍💨", group: "common"   },
  { id: "hairfall",       icon: "🧑‍🦲", group: "moderate" },
  { id: "headache",       icon: "🤕", group: "moderate" },
  { id: "coldextremities",icon: "🧤", group: "moderate" },
  { id: "pica",           icon: "🧱", group: "severe"   },
  { id: "chestpain",      icon: "❤️‍🔥", group: "severe"   },
  { id: "palpitations",   icon: "💓", group: "severe"   },
];

const riskColor = (level) => {
  switch (level?.toLowerCase()) {
    case "low":      return "#10B981";
    case "moderate": return "#F59E0B";
    case "high":     return "#DC2626";
    case "critical": return "#7F1D1D";
    default:         return "#6B7280";
  }
};

const getBMIStatus = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25)   return "Normal";
  if (bmi < 30)   return "Overweight";
  return "Obese";
};

/* ============================================================
   INPUT FIELD COMPONENT
============================================================ */
function InputField({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "#4b5563" }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "11px 13px",
          borderRadius: 14,
          border: "1.5px solid rgba(209,213,219,0.9)",
          outline: "none",
          fontSize: 14,
          background: "linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))",
          boxShadow: "0 6px 16px rgba(148,163,184,0.28), 0 0 0 1px rgba(255,255,255,0.9)",
          color: "#111827",
          boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(156,39,176,0.6)";
          e.target.style.boxShadow = "0 0 0 3px rgba(156,39,176,0.12), 0 6px 16px rgba(148,163,184,0.2)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(209,213,219,0.9)";
          e.target.style.boxShadow = "0 6px 16px rgba(148,163,184,0.28), 0 0 0 1px rgba(255,255,255,0.9)";
        }}
      />
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function AnemiaCheck() {
  const [form, setForm] = useState({
    height: "", weight: "", hemoglobin: "", bmi: "", age: "",
    heavy_periods: false, poor_diet: false, symptoms: {},
    medicalhistory: { frequentheadaches: false, frequentcold: false, faintingepisodes: false, frequentinfections: false },
    academicinfo: { cgpa: "", attendance: "" },
  });
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [lang,    setLang]    = useState(localStorage.getItem("lang") || "en");

  const t = translations[lang] || translations.en;

  /* BMI auto-calc */
  useEffect(() => {
    if (form.height && form.weight) {
      const h = parseFloat(form.height) / 100;
      const w = parseFloat(form.weight);
      if (h > 0 && w > 0) setForm((p) => ({ ...p, bmi: (w / (h * h)).toFixed(1) }));
    }
  }, [form.height, form.weight]);

  const updateSymptom = (id, value) =>
    setForm((p) => ({ ...p, symptoms: { ...p.symptoms, [id]: value } }));

  const groupSymptoms = (group) => symptomsList.filter((s) => s.group === group);

  const chestPainSeverity    = form.symptoms["chestpain"]    || 0;
  const picaSeverity         = form.symptoms["pica"]         || 0;
  const palpitationsSeverity = form.symptoms["palpitations"] || 0;

  const severeFlags = {
    possible_severe_anemia: chestPainSeverity > 40 || palpitationsSeverity > 40,
    pica_present:     picaSeverity > 0,
    chest_pain_high:  chestPainSeverity > 40,
    palpitations_high:palpitationsSeverity > 40,
  };

  const symptomSummary = {
    common:   groupSymptoms("common").map   ((s) => ({ id: s.id, label: t.symptomLabels[s.id], severity: form.symptoms[s.id] || 0 })),
    moderate: groupSymptoms("moderate").map ((s) => ({ id: s.id, label: t.symptomLabels[s.id], severity: form.symptoms[s.id] || 0 })),
    severe:   groupSymptoms("severe").map   ((s) => ({ id: s.id, label: t.symptomLabels[s.id], severity: form.symptoms[s.id] || 0 })),
  };

  /* ---- DOWNLOAD EXCEL ---- */
  const downloadExcel = () => {
    if (!result) return;
    const wb = XLSX.utils.book_new();
    const summaryData = [
      ["ANEMIA RISK ANALYSIS REPORT"], ["Generated on", new Date().toLocaleString()], [],
      ["RISK ASSESSMENT"],
      ["Risk Score", `${result.riskscore}%`], ["Risk Level", result.risklevel.toUpperCase()],
      ["Anaemia Status", result.anaemiaStatus], ["Hemoglobin Level", `${result.hemoglobin} g/dL`], [],
      ["PERSONAL HEALTH INFORMATION"],
      ["Age", form.age], ["Height (cm)", form.height], ["Weight (kg)", form.weight], ["BMI", form.bmi], [],
      ["RISK FACTORS"],
      ["Heavy Menstrual Bleeding", form.heavy_periods ? "Yes" : "No"],
      ["Poor Diet / Iron-poor Meals", form.poor_diet ? "Yes" : "No"],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 35 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    const symptomsData = [
      ["SYMPTOMS SEVERITY ASSESSMENT"], [],
      ["COMMON SYMPTOMS (🟣)"], ["Symptom", "Severity (%)"],
      ...symptomSummary.common.map((s) => [s.label, s.severity]), [],
      ["MODERATE SYMPTOMS (🟡)"], ["Symptom", "Severity (%)"],
      ...symptomSummary.moderate.map((s) => [s.label, s.severity]), [],
      ["SEVERE SYMPTOMS (🔴)"], ["Symptom", "Severity (%)"],
      ...symptomSummary.severe.map((s) => [s.label, s.severity]),
    ];
    const symptomsWs = XLSX.utils.aoa_to_sheet(symptomsData);
    symptomsWs["!cols"] = [{ wch: 40 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, symptomsWs, "Symptoms");

    const analysisData = [
      ["DETAILED ANALYSIS & RECOMMENDATIONS"], [],
      ["IDENTIFIED RISK FACTORS"],
      ...result.riskfactors.map((f, i) => [`${i + 1}. ${f}`]), [],
      ["CLINICAL RECOMMENDATIONS"],
      ...result.recommendations.map((r, i) => [`${i + 1}. ${r}`]), [],
      ["MEDICAL NOTE"], [result.medicalnote], [],
      ["IMPORTANT"], ["This assessment is for educational purposes and should not replace professional medical advice."],
    ];
    const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
    analysisWs["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, analysisWs, "Analysis");

    const metricsData = [
      ["DETAILED HEALTH METRICS"], [],
      ["Health Parameter", "Value", "Status"],
      ["Hemoglobin (g/dL)", result.hemoglobin, result.anaemiaStatus],
      ["BMI", form.bmi, getBMIStatus(parseFloat(form.bmi))],
      ["Age", form.age, "Recorded"], [],
      ["SEVERE FLAG INDICATORS"],
      ["Possible Severe Anemia", severeFlags.possible_severe_anemia ? "Yes ⚠️" : "No"],
      ["Pica Present",           severeFlags.pica_present           ? "Yes ⚠️" : "No"],
      ["Chest Pain High",        severeFlags.chest_pain_high        ? "Yes ⚠️" : "No"],
      ["Palpitations High",      severeFlags.palpitations_high      ? "Yes ⚠️" : "No"],
      [], ["ASSESSMENT DATE", new Date().toLocaleDateString()],
    ];
    const metricsWs = XLSX.utils.aoa_to_sheet(metricsData);
    metricsWs["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, metricsWs, "Metrics");
    XLSX.writeFile(wb, `Anemia_Analysis_${new Date().toISOString().slice(0, 10)}_${new Date().getHours()}-${new Date().getMinutes()}.xlsx`);
  };

  /* ---- DOWNLOAD PDF ---- */
  const downloadMedicalPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFillColor(156, 39, 176);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255); doc.setFontSize(16);
    doc.text("ANEMIA MEDICAL ASSESSMENT REPORT", 105, 14, { align: "center" });
    doc.setTextColor(0); doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.setFontSize(14); doc.text("Patient Summary", 14, 40);
    autoTable(doc, {
      startY: 44, theme: "grid", head: [["Parameter", "Value"]],
      body: [["Age", form.age], ["Height", `${form.height} cm`], ["Weight", `${form.weight} kg`],
             ["BMI", form.bmi], ["Hemoglobin", `${result.hemoglobin} g/dL`], ["Anemia Status", result.anaemiaStatus]],
    });
    let y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14); doc.text("Risk Assessment", 14, y);
    doc.setFontSize(24); doc.text(`${result.riskscore}%`, 14, y + 12);
    doc.setFontSize(12); doc.text(`Risk Level: ${result.risklevel.toUpperCase()}`, 14, y + 22);
    y += 34;
    doc.setFontSize(14); doc.text("Identified Risk Factors", 14, y);
    doc.setFontSize(11);
    result.riskfactors.forEach((r, i) => doc.text(`• ${r}`, 16, y + 8 + i * 6));
    y = y + 14 + result.riskfactors.length * 6;
    doc.setFontSize(14); doc.text("Medical Recommendations", 14, y);
    result.recommendations.forEach((r, i) => doc.text(`• ${r}`, 16, y + 8 + i * 6));
    y = y + 14 + result.recommendations.length * 6;
    doc.setFontSize(12); doc.text("Medical Note", 14, y);
    doc.setFontSize(10); doc.text(result.medicalnote, 14, y + 8, { maxWidth: 180 });
    y += 26; doc.setFontSize(9); doc.setTextColor(120);
    doc.text("⚠️ Disclaimer: This AI-generated report is for screening purposes only and does not replace professional medical diagnosis.", 14, y, { maxWidth: 180 });
    doc.save(`Anemia_Medical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* ---- ANALYZE ---- */
  const analyzeData = async () => {
    if (!form.height || !form.weight || !form.hemoglobin || !form.age) {
      setError(t.fillRequired); return;
    }
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError(t.loginRequired);
      setTimeout(() => { window.location.href = "/login"; }, 1500);
      return;
    }
    setLoading(true); setError(null);
    try {
      const payload = {
        hemoglobin: parseFloat(form.hemoglobin), bmi: parseFloat(form.bmi),
        age: parseInt(form.age), height: parseFloat(form.height), weight: parseFloat(form.weight),
        heavy_periods: form.heavy_periods, poor_diet: form.poor_diet,
        symptoms: form.symptoms, symptom_summary: symptomSummary,
        flags: severeFlags, medicalhistory: form.medicalhistory, academicinfo: form.academicinfo,
      };
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/anemia/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("auth_token");
        setError("Session expired. Please log in again.");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult({
        riskscore: data.risk_score, risklevel: data.risk_level, anaemiaStatus: data.anaemia_status,
        hemoglobin: data.hemoglobin, riskfactors: data.risk_factors || [],
        recommendations: data.recommendations || [], medicalnote: data.medical_note,
        timestamp: data.timestamp, checkId: data.check_id, userName: data.user_name,
      });
      setError(null);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Unable to analyze data. Please try again.");
      setResult(null);
    } finally { setLoading(false); }
  };

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="ac-page">
      <div className="ac-container">

        {/* ── BACK BUTTON ── */}
        <div style={{ marginBottom: 16 }}>
          <button
            className="ac-back-btn"
            onClick={() => (window.location.href = "/dashboard")}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#9C27B0"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(156,39,176,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; e.currentTarget.style.color = "#9C27B0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(148,163,184,0.25)"; }}
          >
            <span>←</span>
            <span className="back-label">{t.backToDashboard}</span>
          </button>
        </div>

        {/* ── HEADER ── */}
        <div className="ac-header-row">
          <div className="ac-header-left">
            <img src={Logo} alt="Logo" className="ac-logo" />
            <div className="ac-header-text">
              <h1 className="ac-title">{t.title}</h1>
              <p className="ac-subtitle">{t.subtitle}</p>
            </div>
          </div>
          <button
            className="ac-lang-btn"
            onClick={() => { const n = lang === "en" ? "te" : lang === "te" ? "hi" : "en"; setLang(n); localStorage.setItem("lang", n); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F3E8FF"; e.currentTarget.style.color = "#9C27B0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.color = "#6B7280"; }}
          >
            <Globe size={16} />{lang.toUpperCase()}
          </button>
        </div>

        {/* ── INPUT CARD ── */}
        <div className="ac-card" style={{ marginBottom: 18 }}>
          <div className="ac-section-title">{t.basicDetails}</div>

          {/* 3 inputs: height / weight / hemoglobin */}
          <div className="ac-inputs-grid">
            <InputField label={t.height}     value={form.height}     onChange={(v) => setForm({ ...form, height: v })} />
            <InputField label={t.weight}     value={form.weight}     onChange={(v) => setForm({ ...form, weight: v })} />
            <InputField label={t.hemoglobin} value={form.hemoglobin} onChange={(v) => setForm({ ...form, hemoglobin: v })} />
          </div>

          {/* Age + BMI row */}
          <div className="ac-age-bmi-row">
            <div className="ac-age-field">
              <InputField label={t.age} value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            </div>
            <div className="ac-bmi-box">
              <div style={{ fontSize: 13, fontWeight: 500, color: "#4b5563" }}>{t.bmi}</div>
              <div className="ac-bmi-value">{form.bmi || "0.0"}</div>
              <div className="ac-bmi-chip">
                <span>📊</span>
                <span className="ac-bmi-chip-label">{t.bmiAuto}</span>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#4b5563", marginBottom: 10 }}>
              {t.riskFactors}
            </div>
            <div className="ac-toggle-row">
              {[
                { key: "heavy_periods", label: t.heavyPeriods },
                { key: "poor_diet",    label: t.poorDiet     },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`ac-pill ${form[key] ? "ac-pill-on" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    style={{ accentColor: "#9C27B0" }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── SYMPTOMS CARD ── */}
        <div className="ac-card">
          <div className="ac-section-title">{t.symptoms}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
            {t.symptomsGuide}
          </div>

          <div className="ac-symptoms-grid">
            {symptomsList.map((s) => (
              <div key={s.id} className="ac-symptom-card">
                <div className="ac-slider-header">
                  <span className="ac-slider-label">
                    {s.icon} {t.symptomLabels[s.id]}{" "}
                    {s.group === "common" ? "🟣" : s.group === "moderate" ? "🟡" : "🔴"}
                  </span>
                  <span className="ac-slider-pct">{form.symptoms[s.id] || 0}%</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={form.symptoms[s.id] || 0}
                  onChange={(e) => updateSymptom(s.id, parseInt(e.target.value, 10))}
                  className="ac-range"
                />
              </div>
            ))}
          </div>

          {error && <div className="ac-error">⚠️ {error}</div>}

          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <button
              onClick={analyzeData}
              disabled={loading}
              className="ac-analyze-btn"
              style={{ opacity: loading ? 0.82 : 1, cursor: loading ? "wait" : "pointer" }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(156,39,176,0.55)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(156,39,176,0.45), 0 4px 10px rgba(129,140,248,0.5)"; }}
            >
              <span>🔍</span>
              <span>{loading ? t.analyzing : t.analyzeButton}</span>
            </button>
          </div>
        </div>

        {/* ── RESULT CARD ── */}
        {result && (
          <div className="ac-result-card" style={{ borderColor: riskColor(result.risklevel) }}>
            {/* Score + chip */}
            <div className="ac-result-top">
              <div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{t.riskLevel}</div>
                <div className="ac-result-score">{result.riskscore}%</div>
              </div>
              <span
                className="ac-risk-chip"
                style={{ background: riskColor(result.risklevel) }}
              >
                {result.risklevel}
              </span>
            </div>

            {result.userName && (
              <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>
                ✅ Saved for: <b style={{ color: "#9C27B0" }}>{result.userName}</b>
              </div>
            )}
            <div style={{ marginTop: 6, fontSize: 14, color: "#374151" }}>
              <b>{t.status}:</b> {result.anaemiaStatus}
            </div>
            <div style={{ marginTop: 3, fontSize: 14, color: "#374151" }}>
              <b>{t.hemoglobin}:</b> {result.hemoglobin} g/dL
            </div>
            {result.checkId && (
              <div style={{ marginTop: 3, fontSize: 12, color: "#6b7280" }}>
                <b>{t.checkId}:</b> #{result.checkId}
              </div>
            )}

            <div className="ac-list-title">{t.riskFactorsList}</div>
            <ul className="ac-list">
              {result.riskfactors.map((r, i) => <li key={i}>{r}</li>)}
            </ul>

            <div className="ac-list-title">{t.recommendations}</div>
            <ul className="ac-list">
              {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>

            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>{result.medicalnote}</p>

            {/* Download buttons */}
            <div className="ac-download-row">
              <button
                onClick={downloadExcel}
                className="ac-dl-btn ac-dl-excel"
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 22px rgba(16,185,129,0.48)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none";              e.currentTarget.style.boxShadow = "0 8px 16px rgba(16,185,129,0.35)"; }}
              >
                <span>📥</span>
                <span className="ac-dl-label">{t.downloadExcel}</span>
              </button>
              <button
                onClick={downloadMedicalPDF}
                className="ac-dl-btn ac-dl-pdf"
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 22px rgba(239,68,68,0.48)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none";             e.currentTarget.style.boxShadow = "0 8px 16px rgba(239,68,68,0.35)"; }}
              >
                <span>🩺</span>
                <span className="ac-dl-label">{t.downloadPDF}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════
          RESPONSIVE CSS
      ════════════════════════════════════════════════ */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }

        /* ─── PAGE SHELL ─── */
        .ac-page {
          min-height: 100vh;
          padding: 14px 14px 40px;
          background: linear-gradient(135deg, #ffe2f3 0%, #f7d7ff 35%, #f4e7ff 70%, #ffe6f0 100%);
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1f2933;
        }
        .ac-container {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }

        /* ─── BACK BUTTON ─── */
        .ac-back-btn {
          background: rgba(255,255,255,0.92);
          border: 1.5px solid rgba(156,39,176,0.3);
          border-radius: 12px;
          padding: 9px 16px;
          font-size: 13px;
          font-weight: 600;
          color: #9C27B0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 4px 14px rgba(148,163,184,0.25);
          transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .back-label { display: inline; }

        /* ─── HEADER ─── */
        .ac-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .ac-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .ac-logo {
          height: 38px;
          width: auto;
          max-width: 80px;
          border-radius: 10px;
          object-fit: contain;
          box-shadow: 0 4px 12px rgba(156,39,176,0.3);
          background: white;
          padding: 3px;
          flex-shrink: 0;
        }
        .ac-header-text { min-width: 0; }
        .ac-title {
          margin: 0 0 2px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #9C27B0;
          line-height: 1.2;
        }
        .ac-subtitle {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }
        .ac-lang-btn {
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(156,39,176,0.2);
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6B7280;
          font-size: 13px;
          font-weight: 600;
          padding: 7px 12px;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ─── CARD ─── */
        .ac-card {
          background: rgba(255,255,255,0.85);
          border-radius: 20px;
          padding: 16px 14px;
          box-shadow: 0 20px 40px rgba(148,27,147,0.1), 0 0 0 1px rgba(255,255,255,0.7);
          backdrop-filter: blur(16px);
          margin-bottom: 16px;
        }
        .ac-section-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #4b5563;
        }

        /* ─── INPUTS GRID
             mobile:  1-col
             480px+:  2-col
             720px+:  3-col (original)  ─── */
        .ac-inputs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 480px) {
          .ac-inputs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 720px) {
          .ac-inputs-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }

        /* ─── AGE + BMI ROW ─── */
        .ac-age-bmi-row {
          display: flex;
          gap: 14px;
          margin-top: 16px;
          flex-wrap: wrap;
          align-items: flex-start;
        }
        .ac-age-field { flex: 1; min-width: 100px; }
        .ac-bmi-box {
          min-width: 130px;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(156,39,176,0.06), rgba(129,140,248,0.08));
          border-radius: 14px;
          border: 1px solid rgba(156,39,176,0.15);
          flex-shrink: 0;
        }
        .ac-bmi-value {
          font-size: 26px;
          font-weight: 800;
          color: #9C27B0;
          margin: 4px 0;
          line-height: 1;
        }
        .ac-bmi-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 999px;
          background: linear-gradient(120deg, rgba(156,39,176,0.08), rgba(129,140,248,0.12));
          color: #6b21a8;
          font-size: 11px;
          margin-top: 4px;
        }
        .ac-bmi-chip-label { display: none; }

        /* ─── RISK FACTOR PILLS ─── */
        .ac-toggle-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .ac-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(209,213,219,0.6);
          font-size: 13px;
          color: #374151;
          box-shadow: 0 3px 6px rgba(148,163,184,0.2);
          transition: all 0.18s ease-out;
        }
        .ac-pill.ac-pill-on {
          background: rgba(156,39,176,0.1);
          border-color: rgba(156,39,176,0.45);
          box-shadow: 0 6px 14px rgba(156,39,176,0.22);
          color: #6b21a8;
          font-weight: 600;
        }

        /* ─── SYMPTOMS GRID
             mobile:  1-col
             480px+:  2-col (original)  ─── */
        .ac-symptoms-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .ac-symptoms-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }

        .ac-symptom-card {
          background: rgba(255,255,255,0.9);
          border-radius: 16px;
          padding: 10px 13px 12px;
          box-shadow: 0 6px 14px rgba(148,163,184,0.2);
          border: 1px solid rgba(243,244,246,0.9);
        }
        .ac-slider-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 7px;
          gap: 6px;
        }
        .ac-slider-label {
          font-size: 12px;
          font-weight: 500;
          color: #4b5563;
          line-height: 1.45;
        }
        .ac-slider-pct {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(59,130,246,0.1);
          color: #1d4ed8;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ac-range {
          width: 100%;
          -webkit-appearance: none;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(156,39,176,0.35), rgba(129,140,248,0.6));
          outline: none;
          cursor: pointer;
        }
        .ac-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #9C27B0;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(156,39,176,0.4);
        }

        /* ─── ERROR ─── */
        .ac-error {
          margin-top: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(220,38,38,0.08);
          border: 1px solid rgba(220,38,38,0.25);
          color: #dc2626;
          font-size: 13px;
        }

        /* ─── ANALYZE BUTTON ─── */
        .ac-analyze-btn {
          width: 100%;
          max-width: 100%;
          padding: 13px 24px;
          border-radius: 999px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(90deg, #9C27B0 0%, #8b5cf6 50%, #6366f1 100%);
          box-shadow: 0 10px 24px rgba(156,39,176,0.45), 0 4px 10px rgba(129,140,248,0.5);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        @media (min-width: 480px) {
          .ac-analyze-btn { width: auto; max-width: 420px; padding: 13px 38px; font-size: 15px; }
        }

        /* ─── RESULT CARD ─── */
        .ac-result-card {
          margin-top: 20px;
          padding: 18px 16px;
          border-radius: 20px;
          background: rgba(255,255,255,0.97);
          border: 2px solid #ccc;
          box-shadow: 0 16px 30px rgba(148,163,184,0.4);
        }
        .ac-result-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 12px;
        }
        .ac-result-score {
          font-size: 36px;
          font-weight: 800;
          color: #111827;
          line-height: 1.1;
        }
        .ac-risk-chip {
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }
        .ac-list-title {
          font-size: 14px;
          font-weight: 700;
          margin: 12px 0 5px;
          color: #374151;
        }
        .ac-list {
          padding-left: 18px;
          font-size: 13px;
          color: #4b5563;
          margin: 0 0 4px;
          line-height: 1.7;
        }

        /* ─── DOWNLOAD BUTTONS ─── */
        .ac-download-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
          align-items: stretch;
        }
        .ac-dl-btn {
          padding: 11px 20px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .ac-dl-excel {
          background: linear-gradient(90deg, #10b981, #06b6d4);
          box-shadow: 0 8px 16px rgba(16,185,129,0.35);
        }
        .ac-dl-pdf {
          background: linear-gradient(90deg, #ef4444, #f97316);
          box-shadow: 0 8px 16px rgba(239,68,68,0.35);
        }
        .ac-dl-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* ════════════════════════════════
           TABLET — 600px +
        ════════════════════════════════ */
        @media (min-width: 600px) {
          .ac-page { padding: 22px 24px 48px; }
          .ac-card { padding: 22px 20px; border-radius: 22px; }
          .ac-title { font-size: 26px; }
          .ac-subtitle { font-size: 13px; }
          .ac-logo { height: 44px; max-width: 100px; }
          .ac-back-btn { padding: 10px 18px; font-size: 14px; }
          .ac-bmi-chip-label { display: inline; }
          .ac-analyze-btn { font-size: 15px; }

          /* result card */
          .ac-result-card { padding: 22px; border-radius: 22px; }

          /* download row: side by side */
          .ac-download-row {
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }
          .ac-dl-btn { width: auto; flex: 1; max-width: 260px; }
        }

        /* ════════════════════════════════
           DESKTOP — 900px +
        ════════════════════════════════ */
        @media (min-width: 900px) {
          .ac-page { padding: 32px 40px 56px; }
          .ac-card { padding: 26px 28px; border-radius: 24px; }
          .ac-title { font-size: 30px; }
          .ac-subtitle { font-size: 14px; }
          .ac-logo { height: 50px; max-width: 120px; padding: 4px; }
          .ac-section-title { font-size: 16px; }
          .ac-back-btn { font-size: 14px; }
          .ac-bmi-value { font-size: 30px; }
          .ac-bmi-box { min-width: 180px; }
          .ac-analyze-btn { font-size: 15px; padding: 14px 42px; }

          /* result */
          .ac-result-card { padding: 26px 28px; border-radius: 24px; }
          .ac-result-score { font-size: 40px; }
          .ac-list { font-size: 14px; }

          /* downloads */
          .ac-dl-btn { font-size: 14px; padding: 12px 26px; max-width: 300px; }
        }

        /* ════════════════════════════════
           LARGE DESKTOP — 1200px+
        ════════════════════════════════ */
        @media (min-width: 1200px) {
          .ac-page { padding: 36px 48px 60px; }
        }
      `}</style>
    </div>
  );
}
