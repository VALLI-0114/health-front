import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Globe } from 'lucide-react';
import Logo from "../../assets/Logo.jpg";

export default function AnemiaCheck() {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    hemoglobin: "",
    bmi: "",
    age: "",
    heavy_periods: false,
    poor_diet: false,
    symptoms: {},
    medicalhistory: {
      frequentheadaches: false,
      frequentcold: false,
      faintingepisodes: false,
      frequentinfections: false,
    },
    academicinfo: {
      cgpa: "",
      attendance: "",
    },
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  // Translations object
  const translations = {
    en: {
      title: "Advanced Anemia Detection",
      subtitle: "AI-powered severity-based assessment for early anaemia screening.",
      basicDetails: "Basic Health Details",
      height: "Height (cm)",
      weight: "Weight (kg)",
      hemoglobin: "Hemoglobin (g/dL)",
      age: "Age",
      bmi: "BMI",
      bmiAuto: "Auto from height & weight",
      riskFactors: "Risk factors",
      heavyPeriods: "Heavy menstrual bleeding",
      poorDiet: "Poor diet / iron-poor meals",
      symptoms: "Symptoms (severity sliders)",
      symptomsGuide: "🟣 Common · 🟡 Moderate · 🔴 Severe",
      analyzing: "Analyzing...",
      analyzeButton: "Analyze Anemia Risk",
      riskLevel: "Risk level",
      status: "Status",
      checkId: "Check ID",
      riskFactorsList: "Risk factors",
      recommendations: "Recommendations",
      downloadExcel: "Download Analysis Report (Excel)",
      downloadPDF: "Download Medical PDF",
      fillRequired: "Please fill all required fields",
      loginRequired: "Please log in to analyze. Redirecting...",
      backToDashboard: "Back to Dashboard",
      symptomLabels: {
        tiredness: "Constant Tiredness",
        weakness: "Weakness / Low Energy",
        paleskin: "Pale Skin / Lips",
        dizziness: "Dizziness / Light-headedness",
        breathlessness: "Breathlessness",
        hairfall: "Hair Fall / Thinning",
        headache: "Headache",
        coldextremities: "Cold Hands & Feet",
        pica: "Pica (Mud / Chalk / Ice Craving)",
        chestpain: "Chest Pain",
        palpitations: "Palpitations / Fast Heartbeat",
      },
    },

    te: {
      title: "అనీమియా అధునాతన పరీక్ష",
      subtitle: "ముందస్తు అనీమియా స్క్రీనింగ్ కోసం AI ఆధారిత తీవ్రత అంచనా.",
      basicDetails: "ప్రాథమిక ఆరోగ్య వివరాలు",
      height: "ఎత్తు (సెం.మీ)",
      weight: "బరువు (కిలోలు)",
      hemoglobin: "హిమోగ్లోబిన్ (g/dL)",
      age: "వయస్సు",
      bmi: "BMI",
      bmiAuto: "ఎత్తు & బరువు నుండి స్వయంచాలకంగా",
      riskFactors: "ప్రమాద కారకాలు",
      heavyPeriods: "అధిక రక్తస్రావం",
      poorDiet: "పేలవమైన ఆహారం / ఇనుము లేని భోజనం",
      symptoms: "లక్షణాలు (తీవ్రత స్లైడర్లు)",
      symptomsGuide: "🟣 సాధారణం · 🟡 మధ్యస్థం · 🔴 తీవ్రమైనది",
      analyzing: "విశ్లేషిస్తోంది...",
      analyzeButton: "అనీమియా ప్రమాదాన్ని విశ్లేషించండి",
      riskLevel: "ప్రమాద స్థాయి",
      status: "స్థితి",
      checkId: "తనిఖీ ID",
      riskFactorsList: "ప్రమాద కారకాలు",
      recommendations: "సిఫార్సులు",
      downloadExcel: "విశ్లేషణ నివేదికను డౌన్‌లోడ్ చేయండి (Excel)",
      downloadPDF: "వైద్య PDF డౌన్‌లోడ్ చేయండి",
      fillRequired: "దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి",
      loginRequired: "విశ్లేషించడానికి దయచేసి లాగిన్ అవ్వండి.",
      backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
      symptomLabels: {
        tiredness: "నిరంతర అలసట",
        weakness: "బలహీనత / తక్కువ శక్తి",
        paleskin: "లేత చర్మం / పెదవులు",
        dizziness: "తలతిరగడం / తేలికగా అనిపించడం",
        breathlessness: "ఊపిరి ఆడకపోవడం",
        hairfall: "జుట్టు రాలడం / సన్నబడటం",
        headache: "తలనొప్పి",
        coldextremities: "చల్లని చేతులు & కాళ్ళు",
        pica: "పైకా (మట్టి / సుద్ద / మంచు కోరిక)",
        chestpain: "ఛాతీ నొప్పి",
        palpitations: "గుండె వేగంగా కొట్టుకోవడం",
      },
    },

    hi: {
      title: "उन्नत एनीमिया जांच",
      subtitle: "प्रारंभिक एनीमिया स्क्रीनिंग के लिए AI आधारित गंभीरता मूल्यांकन।",
      basicDetails: "बुनियादी स्वास्थ्य विवरण",
      height: "ऊंचाई (सेमी)",
      weight: "वजन (किलो)",
      hemoglobin: "हीमोग्लोबिन (g/dL)",
      age: "आयु",
      bmi: "BMI",
      bmiAuto: "ऊंचाई और वजन से स्वतः",
      riskFactors: "जोखिम कारक",
      heavyPeriods: "अत्यधिक मासिक धर्म रक्तस्राव",
      poorDiet: "खराब आहार / आयरन की कमी वाला भोजन",
      symptoms: "लक्षण (गंभीरता स्लाइडर)",
      symptomsGuide: "🟣 सामान्य · 🟡 मध्यम · 🔴 गंभीर",
      analyzing: "विश्लेषण हो रहा है...",
      analyzeButton: "एनीमिया जोखिम का विश्लेषण करें",
      riskLevel: "जोखिम स्तर",
      status: "स्थिति",
      checkId: "जांच ID",
      riskFactorsList: "जोखिम कारक",
      recommendations: "सिफारिशें",
      downloadExcel: "विश्लेषण रिपोर्ट डाउनलोड करें (Excel)",
      downloadPDF: "चिकित्सा PDF डाउनलोड करें",
      fillRequired: "कृपया सभी आवश्यक फ़ील्ड भरें",
      loginRequired: "विश्लेषण के लिए कृपया लॉगिन करें।",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      symptomLabels: {
        tiredness: "लगातार थकान",
        weakness: "कमजोरी / कम ऊर्जा",
        paleskin: "पीली त्वचा / होंठ",
        dizziness: "चक्कर आना / हल्कापन महसूस होना",
        breathlessness: "सांस फूलना",
        hairfall: "बालों का झड़ना / पतला होना",
        headache: "सिरदर्द",
        coldextremities: "ठंडे हाथ और पैर",
        pica: "पाइका (मिट्टी / चाक / बर्फ की लालसा)",
        chestpain: "सीने में दर्द",
        palpitations: "धड़कन तेज होना",
      },
    },
  };

  const t = translations[lang];

  /* ---------------- BMI CALCULATION ---------------- */
  useEffect(() => {
    if (form.height && form.weight) {
      const h = parseFloat(form.height) / 100;
      const w = parseFloat(form.weight);
      if (h > 0 && w > 0) {
        const bmi = w / (h * h);
        setForm((prev) => ({ ...prev, bmi: bmi.toFixed(1) }));
      }
    }
  }, [form.height, form.weight]);

  /* ---------------- SYMPTOMS (WITH GROUPS) ---------------- */
  const symptomsList = [
    { id: "tiredness", icon: "😴", group: "common" },
    { id: "weakness", icon: "💤", group: "common" },
    { id: "paleskin", icon: "😶", group: "common" },
    { id: "dizziness", icon: "🌀", group: "common" },
    { id: "breathlessness", icon: "😮‍💨", group: "common" },
    { id: "hairfall", icon: "🧑‍🦲", group: "moderate" },
    { id: "headache", icon: "🤕", group: "moderate" },
    { id: "coldextremities", icon: "🧤", group: "moderate" },
    { id: "pica", icon: "🧱", group: "severe" },
    { id: "chestpain", icon: "❤️‍🔥", group: "severe" },
    { id: "palpitations", icon: "💓", group: "severe" },
  ];

  const updateSymptom = (id, value) => {
    setForm((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [id]: value },
    }));
  };

  const groupSymptoms = (group) =>
    symptomsList.filter((s) => s.group === group);

  /* ---------------- DERIVED FLAGS ---------------- */
  const chestPainSeverity = form.symptoms["chestpain"] || 0;
  const picaSeverity = form.symptoms["pica"] || 0;
  const palpitationsSeverity = form.symptoms["palpitations"] || 0;

  const severeFlags = {
    possible_severe_anemia: chestPainSeverity > 40 || palpitationsSeverity > 40,
    pica_present: picaSeverity > 0,
    chest_pain_high: chestPainSeverity > 40,
    palpitations_high: palpitationsSeverity > 40,
  };

  const symptomSummary = {
    common: groupSymptoms("common").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    moderate: groupSymptoms("moderate").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    severe: groupSymptoms("severe").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
  };

  /* ---------------- DOWNLOAD EXCEL ---------------- */
  const downloadExcel = () => {
    if (!result) return;

    const wb = XLSX.utils.book_new();

    const summaryData = [
      ["ANEMIA RISK ANALYSIS REPORT"],
      ["Generated on", new Date().toLocaleString()],
      [],
      ["RISK ASSESSMENT"],
      ["Risk Score", `${result.riskscore}%`],
      ["Risk Level", result.risklevel.toUpperCase()],
      ["Anaemia Status", result.anaemiaStatus],
      ["Hemoglobin Level", `${result.hemoglobin} g/dL`],
      [],
      ["PERSONAL HEALTH INFORMATION"],
      ["Age", form.age],
      ["Height (cm)", form.height],
      ["Weight (kg)", form.weight],
      ["BMI", form.bmi],
      [],
      ["RISK FACTORS"],
      ["Heavy Menstrual Bleeding", form.heavy_periods ? "Yes" : "No"],
      ["Poor Diet / Iron-poor Meals", form.poor_diet ? "Yes" : "No"],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 35 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    const symptomsData = [
      ["SYMPTOMS SEVERITY ASSESSMENT"],
      [],
      ["COMMON SYMPTOMS (🟣)"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.common.map((s) => [s.label, s.severity]),
      [],
      ["MODERATE SYMPTOMS (🟡)"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.moderate.map((s) => [s.label, s.severity]),
      [],
      ["SEVERE SYMPTOMS (🔴)"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.severe.map((s) => [s.label, s.severity]),
    ];

    const symptomsWs = XLSX.utils.aoa_to_sheet(symptomsData);
    symptomsWs["!cols"] = [{ wch: 40 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, symptomsWs, "Symptoms");

    const analysisData = [
      ["DETAILED ANALYSIS & RECOMMENDATIONS"],
      [],
      ["IDENTIFIED RISK FACTORS"],
      ...result.riskfactors.map((factor, index) => [`${index + 1}. ${factor}`]),
      [],
      ["CLINICAL RECOMMENDATIONS"],
      ...result.recommendations.map((rec, index) => [`${index + 1}. ${rec}`]),
      [],
      ["MEDICAL NOTE"],
      [result.medicalnote],
      [],
      ["IMPORTANT"],
      ["This assessment is for educational purposes and should not replace professional medical advice."],
    ];

    const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
    analysisWs["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, analysisWs, "Analysis");

    const metricsData = [
      ["DETAILED HEALTH METRICS"],
      [],
      ["Health Parameter", "Value", "Status"],
      ["Hemoglobin (g/dL)", result.hemoglobin, result.anaemiaStatus],
      ["BMI", form.bmi, getBMIStatus(parseFloat(form.bmi))],
      ["Age", form.age, "Recorded"],
      [],
      ["SEVERE FLAG INDICATORS"],
      ["Possible Severe Anemia", severeFlags.possible_severe_anemia ? "Yes ⚠️" : "No"],
      ["Pica Present", severeFlags.pica_present ? "Yes ⚠️" : "No"],
      ["Chest Pain High", severeFlags.chest_pain_high ? "Yes ⚠️" : "No"],
      ["Palpitations High", severeFlags.palpitations_high ? "Yes ⚠️" : "No"],
      [],
      ["ASSESSMENT DATE", new Date().toLocaleDateString()],
    ];

    const metricsWs = XLSX.utils.aoa_to_sheet(metricsData);
    metricsWs["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, metricsWs, "Metrics");

    const filename = `Anemia_Analysis_${new Date().toISOString().slice(0, 10)}_${new Date().getHours()}-${new Date().getMinutes()}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  /* ---------------- DOWNLOAD PDF ---------------- */
  const downloadMedicalPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFillColor(156, 39, 176);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("ANEMIA MEDICAL ASSESSMENT REPORT", 105, 14, { align: "center" });

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    doc.setFontSize(14);
    doc.text("Patient Summary", 14, 40);

    autoTable(doc, {
      startY: 44,
      theme: "grid",
      head: [["Parameter", "Value"]],
      body: [
        ["Age", form.age],
        ["Height", `${form.height} cm`],
        ["Weight", `${form.weight} kg`],
        ["BMI", form.bmi],
        ["Hemoglobin", `${result.hemoglobin} g/dL`],
        ["Anemia Status", result.anaemiaStatus],
      ],
    });

    let y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Risk Assessment", 14, y);
    doc.setFontSize(24);
    doc.text(`${result.riskscore}%`, 14, y + 12);
    doc.setFontSize(12);
    doc.text(`Risk Level: ${result.risklevel.toUpperCase()}`, 14, y + 22);

    y += 34;
    doc.setFontSize(14);
    doc.text("Identified Risk Factors", 14, y);
    doc.setFontSize(11);
    result.riskfactors.forEach((r, i) => {
      doc.text(`• ${r}`, 16, y + 8 + i * 6);
    });

    y = y + 14 + result.riskfactors.length * 6;
    doc.setFontSize(14);
    doc.text("Medical Recommendations", 14, y);
    result.recommendations.forEach((r, i) => {
      doc.text(`• ${r}`, 16, y + 8 + i * 6);
    });

    y = y + 14 + result.recommendations.length * 6;
    doc.setFontSize(12);
    doc.text("Medical Note", 14, y);
    doc.setFontSize(10);
    doc.text(result.medicalnote, 14, y + 8, { maxWidth: 180 });

    y += 26;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "⚠️ Disclaimer: This AI-generated report is for screening purposes only and does not replace professional medical diagnosis.",
      14,
      y,
      { maxWidth: 180 }
    );

    doc.save(`Anemia_Medical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  /* ================================================================
   * ✅ FIX 1: Removed hardcoded user_id: 1
   * ✅ FIX 2: URL changed from /anemia/check → /anaemia/check
   * ✅ FIX 3: Token is now required — shows error if not logged in
   * ================================================================ */
  const analyzeData = async () => {
    if (!form.height || !form.weight || !form.hemoglobin || !form.age) {
      setError(t.fillRequired);
      return;
    }

    // ✅ FIX 3: Hard-check for token BEFORE making the request
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError(t.loginRequired);
      setLoading(false);
      // Redirect to login after short delay so user can read message
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ FIX 1: NO user_id in payload — backend reads it from JWT token
      const payload = {
        hemoglobin: parseFloat(form.hemoglobin),
        bmi: parseFloat(form.bmi),
        age: parseInt(form.age),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        heavy_periods: form.heavy_periods,
        poor_diet: form.poor_diet,
        symptoms: form.symptoms,
        symptom_summary: symptomSummary,
        flags: severeFlags,
        medicalhistory: form.medicalhistory,
        academicinfo: form.academicinfo,
      };

      // ✅ FIX 2: Correct URL — /anaemia/check (double 'a') matches Flask blueprint
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/anemia/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIX 3: Always send token
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        // Token expired or invalid — clear it and redirect
        localStorage.removeItem("auth_token");
        setError("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      setResult({
        riskscore: data.risk_score,
        risklevel: data.risk_level,
        anaemiaStatus: data.anaemia_status,
        hemoglobin: data.hemoglobin,
        riskfactors: data.risk_factors || [],
        recommendations: data.recommendations || [],
        medicalnote: data.medical_note,
        timestamp: data.timestamp,
        checkId: data.check_id,
        userName: data.user_name, // ✅ Display confirmed username from server
      });

      setError(null);

    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Unable to analyze data. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":       return "#10B981";
      case "moderate":  return "#F59E0B";
      case "high":      return "#DC2626";
      case "critical":  return "#7F1D1D";
      default:          return "#6B7280";
    }
  };

  /* ---------------- STYLES ---------------- */
  const pageStyle = {
    minHeight: "100vh",
    padding: "32px 40px 48px",
    background: "linear-gradient(135deg, #ffe2f3 0%, #f7d7ff 35%, #f4e7ff 70%, #ffe6f0 100%)",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1f2933",
  };

  const containerStyle = { maxWidth: 1100, margin: "0 auto" };

  const headerRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  };

  const headerContentStyle = { display: "flex", alignItems: "center", gap: 12 };

  const titleStyle = {
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#9C27B0",
  };

  const subtitleStyle = { fontSize: 14, color: "#6b7280", marginBottom: 24 };

  const cardStyle = {
    background: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 40px rgba(148, 27, 147, 0.12), 0 0 0 1px rgba(255,255,255,0.7)",
    backdropFilter: "blur(16px)",
  };

  const sectionTitleStyle = { fontSize: 16, fontWeight: 600, marginBottom: 12, color: "#4b5563" };

  const grid3Style = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: 18,
  };

  const chipStyle = {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    background: "linear-gradient(120deg, rgba(156,39,176,0.08), rgba(129,140,248,0.12))",
    color: "#6b21a8",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  const toggleRowStyle = { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 };

  const checkboxPillStyle = (checked) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    backgroundColor: checked ? "rgba(156,39,176,0.12)" : "rgba(255,255,255,0.9)",
    border: `1px solid ${checked ? "rgba(156,39,176,0.5)" : "rgba(209,213,219,0.6)"}`,
    fontSize: 13,
    color: "#374151",
    boxShadow: checked ? "0 8px 14px rgba(156,39,176,0.28)" : "0 3px 6px rgba(148,163,184,0.25)",
    transition: "all 0.18s ease-out",
  });

  const checkboxInputStyle = { accentColor: "#9C27B0" };

  const symptomsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0,1fr))",
    gap: 16,
    marginTop: 10,
  };

  const symptomCardStyle = {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: "10px 14px 12px",
    boxShadow: "0 8px 16px rgba(148,163,184,0.2)",
    border: "1px solid rgba(243,244,246,0.9)",
  };

  const sliderLabelRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  };

  const sliderLabelText = { fontSize: 13, fontWeight: 500, color: "#4b5563" };

  const sliderBubbleStyle = {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.12)",
    color: "#1d4ed8",
  };

  const rangeStyle = {
    width: "100%",
    WebkitAppearance: "none",
    height: 5,
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(156,39,176,0.35), rgba(129,140,248,0.6))",
    outline: "none",
  };

  const bottomBarStyle = { marginTop: 22, display: "flex", justifyContent: "center" };

  const analyzeButtonStyle = {
    padding: "14px 38px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(90deg, #9C27B0 0%, #8b5cf6 50%, #6366f1 100%)",
    boxShadow: "0 12px 24px rgba(156,39,176,0.45), 0 4px 10px rgba(129,140,248,0.55)",
    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
  };

  const errorTextStyle = {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 10,
    padding: "10px 14px",
    borderRadius: 12,
    background: "rgba(220,38,38,0.1)",
    border: "1px solid rgba(220,38,38,0.3)",
  };

  const resultCardStyle = {
    marginTop: 26,
    padding: 22,
    borderRadius: 22,
    background: "rgba(255,255,255,0.95)",
    border: `2px solid ${riskColor(result?.risklevel)}`,
    boxShadow: "0 16px 30px rgba(148,163,184,0.45)",
  };

  const resultHeaderRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  };

  const chipRiskStyle = {
    padding: "4px 11px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: riskColor(result?.risklevel),
    textTransform: "uppercase",
    letterSpacing: 0.06,
  };

  const scoreStyle = { fontSize: 34, fontWeight: 800, color: "#111827" };

  const listTitleStyle = {
    fontSize: 14,
    fontWeight: 600,
    margin: "10px 0 4px",
    color: "#374151",
  };

  const listStyle = { paddingLeft: 18, fontSize: 13, color: "#4b5563", marginBottom: 4 };
  const tinyNoteStyle = { fontSize: 11, color: "#6b7280", marginTop: 6 };

  const downloadButtonStyle = {
    padding: "10px 20px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
    boxShadow: "0 8px 16px rgba(16,185,129,0.35)",
    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
  };

  const langButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6B7280",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* BACK TO DASHBOARD BUTTON */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => window.location.href = "/dashboard"}
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(156,39,176,0.3)",
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "#9C27B0",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(148,163,184,0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#9C27B0";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(156,39,176,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.color = "#9C27B0";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(148,163,184,0.25)";
            }}
          >
            <span>←</span>
            <span>{t.backToDashboard}</span>
          </button>
        </div>

        {/* HEADER - UPDATED LOGO STYLING */}
        <div style={headerRowStyle}>
          <div style={headerContentStyle}>
            <img 
              src={Logo} 
              alt="Logo" 
              style={{ 
                height: 48,
                width: "auto",
                maxWidth: 120,
                borderRadius: "12px", 
                objectFit: "contain",
                boxShadow: "0 4px 12px rgba(156,39,176,0.3)",
                background: "white",
                padding: "4px"
              }} 
            />
            <div>
              <h1 style={titleStyle}>{t.title}</h1>
              <p style={subtitleStyle}>{t.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              const next = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
              setLang(next);
              localStorage.setItem("lang", next);
            }}
            style={langButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3E8FF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <Globe size={18} />
            {lang.toUpperCase()}
          </button>
        </div>

        {/* INPUT CARD */}
        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={sectionTitleStyle}>{t.basicDetails}</div>
          <div style={grid3Style}>
            <Input label={t.height}      value={form.height}      onChange={(v) => setForm({ ...form, height: v })} />
            <Input label={t.weight}      value={form.weight}      onChange={(v) => setForm({ ...form, weight: v })} />
            <Input label={t.hemoglobin}  value={form.hemoglobin}  onChange={(v) => setForm({ ...form, hemoglobin: v })} />
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 18 }}>
            <div style={{ flex: 1 }}>
              <Input label={t.age} value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            </div>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#4b5563" }}>{t.bmi}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{form.bmi || "0.0"}</div>
              <div style={{ marginTop: 6, ...chipStyle }}>
                <span>📊</span>
                <span>{t.bmiAuto}</span>
              </div>
            </div>
          </div>

          {/* RISK FACTORS */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#4b5563" }}>{t.riskFactors}</div>
            <div style={toggleRowStyle}>
              <label style={checkboxPillStyle(form.heavy_periods)}>
                <input
                  type="checkbox"
                  checked={form.heavy_periods}
                  onChange={(e) => setForm({ ...form, heavy_periods: e.target.checked })}
                  style={checkboxInputStyle}
                />
                <span>{t.heavyPeriods}</span>
              </label>
              <label style={checkboxPillStyle(form.poor_diet)}>
                <input
                  type="checkbox"
                  checked={form.poor_diet}
                  onChange={(e) => setForm({ ...form, poor_diet: e.target.checked })}
                  style={checkboxInputStyle}
                />
                <span>{t.poorDiet}</span>
              </label>
            </div>
          </div>
        </div>

        {/* SYMPTOMS CARD */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t.symptoms}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{t.symptomsGuide}</div>

          <div style={symptomsGridStyle}>
            {symptomsList.map((s) => (
              <div key={s.id} style={symptomCardStyle}>
                <div style={sliderLabelRow}>
                  <span style={sliderLabelText}>
                    {s.icon} {t.symptomLabels[s.id]}{" "}
                    {s.group === "common" ? "🟣" : s.group === "moderate" ? "🟡" : "🔴"}
                  </span>
                  <span style={sliderBubbleStyle}>{form.symptoms[s.id] || 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.symptoms[s.id] || 0}
                  onChange={(e) => updateSymptom(s.id, parseInt(e.target.value, 10))}
                  style={rangeStyle}
                />
              </div>
            ))}
          </div>

          {error && <p style={errorTextStyle}>⚠️ {error}</p>}

          <div style={bottomBarStyle}>
            <button
              onClick={analyzeData}
              disabled={loading}
              style={{ ...analyzeButtonStyle, opacity: loading ? 0.8 : 1, cursor: loading ? "wait" : "pointer" }}
            >
              <span>🔍</span>
              <span>{loading ? t.analyzing : t.analyzeButton}</span>
            </button>
          </div>
        </div>

        {/* RESULTS CARD */}
        {result && (
          <div style={resultCardStyle}>
            <div style={resultHeaderRow}>
              <div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>{t.riskLevel}</div>
                <div style={scoreStyle}>{result.riskscore}%</div>
              </div>
              <span style={chipRiskStyle}>{result.risklevel}</span>
            </div>

            {/* ✅ Shows server-confirmed username so you can verify correct user was saved */}
            {result.userName && (
              <div style={{ marginTop: 2, fontSize: 13, color: "#6b7280" }}>
                ✅ Saved for: <b style={{ color: "#9C27B0" }}>{result.userName}</b>
              </div>
            )}

            <div style={{ marginTop: 4, fontSize: 14, color: "#374151" }}>
              <b>{t.status}:</b> {result.anaemiaStatus}
            </div>
            <div style={{ marginTop: 2, fontSize: 14, color: "#374151" }}>
              <b>{t.hemoglobin}:</b> {result.hemoglobin} g/dL
            </div>
            {result.checkId && (
              <div style={{ marginTop: 2, fontSize: 12, color: "#6b7280" }}>
                <b>{t.checkId}:</b> #{result.checkId}
              </div>
            )}

            <div>
              <div style={listTitleStyle}>{t.riskFactorsList}</div>
              <ul style={listStyle}>
                {result.riskfactors.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div>
              <div style={listTitleStyle}>{t.recommendations}</div>
              <ul style={listStyle}>
                {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <p style={tinyNoteStyle}>{result.medicalnote}</p>

            <div style={{ marginTop: 20, textAlign: "center", display: "flex", gap: 14, justifyContent: "center" }}>
              <button
                onClick={downloadExcel}
                onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 20px rgba(16,185,129,0.45)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 16px rgba(16,185,129,0.35)"; }}
                style={downloadButtonStyle}
              >
                <span>📥</span>
                <span>{t.downloadExcel}</span>
              </button>

              <button
                onClick={downloadMedicalPDF}
                onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 20px rgba(239,68,68,0.45)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 16px rgba(239,68,68,0.35)"; }}
                style={{ ...downloadButtonStyle, background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)" }}
              >
                <span>🩺</span>
                <span>{t.downloadPDF}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */
function Input({ label, value, onChange }) {
  const wrapperStyle = { display: "flex", flexDirection: "column", gap: 6 };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: "#4b5563" };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(209,213,219,0.9)",
    outline: "none",
    fontSize: 14,
    background: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
    boxShadow: "0 8px 18px rgba(148,163,184,0.32), 0 0 0 1px rgba(255,255,255,0.9)",
    color: "#111827",
  };

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}
