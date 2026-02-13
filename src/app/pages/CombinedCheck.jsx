import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Globe } from 'lucide-react';
import Logo from "../../assets/Logo.jpg";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function CombinedCheck() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    bmi: "",
    hemoglobin: "",
    heavy_periods: false,
    poor_diet: false,
    cycle_regularity: "regular",
    cycle_length: "",
    bleeding_days: "",
    stress_level: "moderate",
    sleep_hours: "",
    exercise_frequency: "2-3",
    symptoms: {},
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= TRANSLATIONS ================= */
  const translations = {
    en: {
      title: "Combined Anaemia + PCOD Check",
      subtitle: "Unified screening for blood health and hormonal balance.",
      basic: "Basic Health Details",
      symptoms: "Symptoms Severity",
      analyze: "Analyze Combined Risk",
      analyzing: "Analyzing...",
      bmi: "BMI",
      bmiAuto: "Auto from height & weight",
      error: "Please fill all required health details",
      menstrualLifestyle: "Menstrual & lifestyle factors",
      heavyBleeding: "Heavy menstrual bleeding",
      poorDiet: "Poor diet / skipped meals",
      riskLevel: "Risk level",
      status: "Status",
      hemoglobin: "Hemoglobin",
      downloadExcel: "Download Analysis Report (Excel)",
      downloadPDF: "Download Medical PDF",
      riskFactors: "Risk factors",
      recommendations: "Recommendations",
      backToDashboard: "Back to Dashboard",
      inputs: {
        age: "Age",
        height: "Height (cm)",
        weight: "Weight (kg)",
        hemoglobin: "Hemoglobin (g/dL)",
      },
      result: { 
        anaemia: "Anaemia", 
        pcod: "PCOD", 
        risk: "Risk" 
      },
      symptomLabels: {
        tiredness: "Tiredness",
        dizziness: "Dizziness",
        hairfall: "Hair fall",
        irregular_periods: "Irregular periods",
        acne: "Acne",
        pelvic_pain: "Pelvic pain",
      },
    },
    te: {
      title: "సంయుక్త అనీమియా + PCOD పరీక్ష",
      subtitle: "రక్త ఆరోగ్యం మరియు హార్మోన్ సమతుల్యత కోసం ఏకీకృత స్క్రీనింగ్.",
      basic: "ప్రాథమిక ఆరోగ్య వివరాలు",
      symptoms: "లక్షణాల తీవ్రత",
      analyze: "సంయుక్త ప్రమాదాన్ని విశ్లేషించండి",
      analyzing: "విశ్లేషిస్తోంది...",
      bmi: "BMI",
      bmiAuto: "ఎత్తు & బరువు నుండి స్వయంచాలకంగా",
      error: "దయచేసి అన్ని అవసరమైన ఆరోగ్య వివరాలను పూరించండి",
      menstrualLifestyle: "మాసిక ధర్మ & జీవనశైలి కారకాలు",
      heavyBleeding: "అధిక రక్తస్రావం",
      poorDiet: "పేలవమైన ఆహారం / వదిలిపెట్టిన భోజనం",
      riskLevel: "ప్రమాద స్థాయి",
      status: "స్థితి",
      hemoglobin: "హిమోగ్లోబిన్",
      downloadExcel: "విశ్లేషణ నివేదికను డౌన్‌లోడ్ చేయండి (Excel)",
      downloadPDF: "వైద్య PDF డౌన్‌లోడ్ చేయండి",
      riskFactors: "ప్రమాద కారకాలు",
      recommendations: "సిఫార్సులు",
      backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
      inputs: {
        age: "వయస్సు",
        height: "ఎత్తు (సెం.మీ)",
        weight: "బరువు (కిలోలు)",
        hemoglobin: "హిమోగ్లోబిన్ (g/dL)",
      },
      result: { 
        anaemia: "అనీమియా", 
        pcod: "PCOD", 
        risk: "ప్రమాదం" 
      },
      symptomLabels: {
        tiredness: "అలసట",
        dizziness: "తలతిరగడం",
        hairfall: "జుట్టు రాలడం",
        irregular_periods: "క్రమరహిత మాసిక ధర్మం",
        acne: "మొటిమలు",
        pelvic_pain: "కటి నొప్పి",
      },
    },
    hi: {
      title: "संयुक्त एनीमिया + PCOD जांच",
      subtitle: "रक्त स्वास्थ्य और हार्मोनल संतुलन के लिए एकीकृत स्क्रीनिंग।",
      basic: "बुनियादी स्वास्थ्य विवरण",
      symptoms: "लक्षणों की गंभीरता",
      analyze: "संयुक्त जोखिम का विश्लेषण करें",
      analyzing: "विश्लेषण हो रहा है...",
      bmi: "BMI",
      bmiAuto: "ऊंचाई और वजन से स्वतः",
      error: "कृपया सभी आवश्यक स्वास्थ्य विवरण भरें",
      menstrualLifestyle: "मासिक धर्म और जीवनशैली कारक",
      heavyBleeding: "अत्यधिक मासिक धर्म रक्तस्राव",
      poorDiet: "खराब आहार / छूटे हुए भोजन",
      riskLevel: "जोखिम स्तर",
      status: "स्थिति",
      hemoglobin: "हीमोग्लोबिन",
      downloadExcel: "विश्लेषण रिपोर्ट डाउनलोड करें (Excel)",
      downloadPDF: "चिकित्सा PDF डाउनलोड करें",
      riskFactors: "जोखिम कारक",
      recommendations: "सिफारिशें",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      inputs: {
        age: "आयु",
        height: "ऊंचाई (सेमी)",
        weight: "वजन (किलो)",
        hemoglobin: "हीमोग्लोबिन (g/dL)",
      },
      result: { 
        anaemia: "एनीमिया", 
        pcod: "PCOD", 
        risk: "जोखिम" 
      },
      symptomLabels: {
        tiredness: "थकान",
        dizziness: "चक्कर आना",
        hairfall: "बालों का झड़ना",
        irregular_periods: "अनियमित मासिक धर्म",
        acne: "मुंहासे",
        pelvic_pain: "श्रोणि क्षेत्र में दर्द",
      },
    },
  };

  const t = translations[lang];

  /* ================= SYMPTOMS ================= */
  const symptomList = [
    { id: "tiredness", icon: "😴", category: "Anaemia" },
    { id: "dizziness", icon: "🌀", category: "Anaemia" },
    { id: "hairfall", icon: "🧑‍🦲", category: "Anaemia" },
    { id: "irregular_periods", icon: "📅", category: "PCOD" },
    { id: "acne", icon: "🩹", category: "PCOD" },
    { id: "pelvic_pain", icon: "😫", category: "PCOD" },
  ];

  /* ================= BMI AUTO ================= */
  useEffect(() => {
    if (!form.height || !form.weight) return;
    const h = Number(form.height);
    const w = Number(form.weight);
    if (h > 0 && w > 0) {
      const bmi = w / Math.pow(h / 100, 2);
      setForm((p) => ({ ...p, bmi: bmi.toFixed(1) }));
    }
  }, [form.height, form.weight]);

  const updateSymptom = (id, value) =>
    setForm((p) => ({
      ...p,
      symptoms: { ...p.symptoms, [id]: value },
    }));

  /* ================= DOWNLOAD EXCEL FUNCTION ================= */
  const downloadExcel = () => {
    if (!result) {
      alert("Please run the analysis first before downloading the report");
      return;
    }

    const wb = XLSX.utils.book_new();

    // ========== SHEET 1: SUMMARY ==========
    const summaryData = [
      ["COMBINED HEALTH ANALYSIS REPORT"],
      ["Generated on", new Date().toLocaleString()],
      [],
      ["OVERALL RISK ASSESSMENT"],
      ["Combined Risk Score", `${getCombinedScore()}%`],
      ["Overall Risk Level", getOverallRisk().toUpperCase()],
      ["Health Status", getFinalStatus()],
      [],
      ["INDIVIDUAL RISK SCORES"],
      ["Condition", "Risk Score", "Risk Level"],
      ["Anaemia", `${getAnaemiaScore()}%`, getAnaemiaRiskLevel()],
      ["PCOD", `${getPCODScore()}%`, getPCODRiskLevel()],
      [],
      ["PERSONAL HEALTH INFORMATION"],
      ["Age", form.age],
      ["Height (cm)", form.height],
      ["Weight (kg)", form.weight],
      ["BMI", form.bmi],
      ["Hemoglobin (g/dL)", form.hemoglobin],
      [],
      ["MENSTRUAL & LIFESTYLE FACTORS"],
      ["Heavy Menstrual Bleeding", form.heavy_periods ? "Yes" : "No"],
      ["Poor Diet / Iron-poor Meals", form.poor_diet ? "Yes" : "No"],
      ["Cycle Regularity", form.cycle_regularity || "N/A"],
      ["Cycle Length (days)", form.cycle_length || "N/A"],
      ["Bleeding Days", form.bleeding_days || "N/A"],
      ["Sleep Hours", form.sleep_hours || "N/A"],
      ["Stress Level", form.stress_level || "N/A"],
      ["Exercise Frequency", form.exercise_frequency || "N/A"],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 35 }, { wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // ========== SHEET 2: SYMPTOMS BY CATEGORY ==========
    const symptomsData = [
      ["SYMPTOMS SEVERITY ASSESSMENT"],
      [],
      ["ANAEMIA SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomList
        .filter(s => s.category === "Anaemia")
        .map(s => [t.symptomLabels[s.id], form.symptoms[s.id] || 0]),
      [],
      ["PCOD SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomList
        .filter(s => s.category === "PCOD")
        .map(s => [t.symptomLabels[s.id], form.symptoms[s.id] || 0]),
    ];

    const symptomsWs = XLSX.utils.aoa_to_sheet(symptomsData);
    symptomsWs["!cols"] = [{ wch: 40 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, symptomsWs, "Symptoms");

    // ========== SHEET 3: ANALYSIS & RECOMMENDATIONS ==========
    const analysisData = [
      ["DETAILED ANALYSIS & RECOMMENDATIONS"],
      [],
      ["ANAEMIA ANALYSIS"],
      ["Risk Score", `${getAnaemiaScore()}%`],
      ["Risk Level", getAnaemiaRiskLevel()],
      ["Hemoglobin Status", getHemoglobin()],
      [],
      ["PCOD ANALYSIS"],
      ["Risk Score", `${getPCODScore()}%`],
      ["Risk Level", getPCODRiskLevel()],
      ["BMI Status", getBMI()],
      [],
    ];

    const riskFactors = result.combined_analysis?.all_risk_factors || [];
    if (riskFactors.length > 0) {
      analysisData.push(["IDENTIFIED RISK FACTORS"]);
      riskFactors.forEach((factor, index) => {
        analysisData.push([`${index + 1}. ${factor}`]);
      });
      analysisData.push([]);
    }

    const recommendations = result.combined_analysis?.recommendations || result.recommendations || [];
    if (recommendations.length > 0) {
      analysisData.push(["CLINICAL RECOMMENDATIONS"]);
      recommendations.forEach((rec, index) => {
        analysisData.push([`${index + 1}. ${rec}`]);
      });
      analysisData.push([]);
    }

    analysisData.push(["MEDICAL NOTE"]);
    analysisData.push([result.medical_note || "Supervised ML-based combined screening (not a diagnosis)"]);
    analysisData.push([]);
    analysisData.push(["IMPORTANT"]);
    analysisData.push([
      "This assessment is for educational purposes and should not replace professional medical advice. Please consult with a qualified healthcare provider for diagnosis and treatment.",
    ]);

    const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
    analysisWs["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, analysisWs, "Analysis");

    // ========== SHEET 4: DETAILED METRICS ==========
    const metricsData = [
      ["DETAILED HEALTH METRICS"],
      [],
      ["Health Parameter", "Value", "Category", "Status"],
      ["Combined Risk Score", `${getCombinedScore()}%`, "Overall", getOverallRisk()],
      ["Anaemia Risk Score", `${getAnaemiaScore()}%`, "Anaemia", getAnaemiaRiskLevel()],
      ["PCOD Risk Score", `${getPCODScore()}%`, "PCOD", getPCODRiskLevel()],
      ["Hemoglobin (g/dL)", form.hemoglobin, "Anaemia", getHemoglobinStatus()],
      ["BMI", form.bmi, "PCOD", getBMIStatus()],
      [],
      ["SYMPTOM SUMMARY"],
      ["Category", "Symptom", "Severity"],
      ...symptomList.map(s => [
        s.category,
        t.symptomLabels[s.id],
        `${form.symptoms[s.id] || 0}%`
      ]),
      [],
      ["ASSESSMENT DETAILS"],
      ["Assessment Date", new Date().toLocaleDateString()],
      ["Assessment Time", new Date().toLocaleTimeString()],
      ["Report Generated By", "Combined Health Screening System"],
    ];

    const metricsWs = XLSX.utils.aoa_to_sheet(metricsData);
    metricsWs["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, metricsWs, "Detailed Metrics");

    const filename = `Combined_Health_Analysis_${new Date()
      .toISOString()
      .slice(0, 10)}_${new Date().getHours()}-${new Date().getMinutes()}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  /* ================= DOWNLOAD MEDICAL PDF FUNCTION ================= */
  const downloadMedicalPDF = () => {
    if (!result) {
      alert("Please run the analysis first before downloading the report");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFillColor(180, 22, 197);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("COMBINED HEALTH ASSESSMENT REPORT", 105, 14, { align: "center" });

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Patient Summary
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
        ["BMI Status", getBMIStatus()],
        ["Hemoglobin", `${form.hemoglobin} g/dL`],
        ["Hemoglobin Status", getHemoglobinStatus()],
      ],
    });

    let y = doc.lastAutoTable.finalY + 10;

    // Overall Risk Assessment
    doc.setFontSize(14);
    doc.text("Overall Risk Assessment", 14, y);
    doc.setFontSize(24);
    doc.text(`${getCombinedScore()}%`, 14, y + 12);
    doc.setFontSize(12);
    doc.text(`Risk Level: ${getOverallRisk().toUpperCase()}`, 14, y + 22);
    doc.setFontSize(11);
    doc.text(`Health Status: ${getFinalStatus()}`, 14, y + 30);

    // Individual Risk Scores
    y += 44;
    doc.setFontSize(14);
    doc.text("Individual Risk Scores", 14, y);
    
    autoTable(doc, {
      startY: y + 4,
      theme: "grid",
      head: [["Condition", "Risk Score", "Risk Level"]],
      body: [
        ["Anaemia", `${getAnaemiaScore()}%`, getAnaemiaRiskLevel()],
        ["PCOD", `${getPCODScore()}%`, getPCODRiskLevel()],
      ],
    });

    y = doc.lastAutoTable.finalY + 10;

    // Risk Factors
    const riskFactors = result.combined_analysis?.all_risk_factors || [];
    if (riskFactors.length > 0) {
      doc.setFontSize(14);
      doc.text("Identified Risk Factors", 14, y);
      doc.setFontSize(11);
      riskFactors.forEach((r, i) => {
        doc.text(`• ${r}`, 16, y + 8 + i * 6);
      });
      y = y + 14 + riskFactors.length * 6;
    }

    // Recommendations
    const recommendations = result.combined_analysis?.recommendations || result.recommendations || [];
    if (recommendations.length > 0) {
      doc.setFontSize(14);
      doc.text("Medical Recommendations", 14, y);
      doc.setFontSize(11);
      recommendations.forEach((r, i) => {
        doc.text(`• ${r}`, 16, y + 8 + i * 6);
      });
      y = y + 14 + recommendations.length * 6;
    }

    // Medical Note
    doc.setFontSize(12);
    doc.text("Medical Note", 14, y);
    doc.setFontSize(10);
    const medicalNote = result.medical_note || "Supervised ML-based combined screening (not a diagnosis)";
    doc.text(medicalNote, 14, y + 8, { maxWidth: 180 });

    // Disclaimer
    y += 26;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "⚠️ Disclaimer: This AI-generated report is for screening purposes only and does not replace professional medical diagnosis.",
      14,
      y,
      { maxWidth: 180 }
    );

    doc.save(`Combined_Health_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Helper functions for Excel/PDF data
  const getHemoglobinStatus = () => {
    const hb = parseFloat(form.hemoglobin);
    if (!hb) return "N/A";
    if (hb < 7) return "Severe Anaemia";
    if (hb < 10) return "Moderate Anaemia";
    if (hb < 12) return "Mild Anaemia";
    if (hb <= 16) return "Normal";
    return "Above Normal";
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(form.bmi);
    if (!bmi) return "N/A";
    if (bmi < 16) return "Severely Underweight";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  /* ================= ANALYZE ================= */
  const analyze = async () => {
    if (!form.age || !form.height || !form.weight || !form.hemoglobin) {
      setError(t.error);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        bmi: Number(form.bmi),
        hemoglobin: Number(form.hemoglobin),
        cycle_length: Number(form.cycle_length || 28),
        bleeding_days: Number(form.bleeding_days || 5),
        sleep_hours: Number(form.sleep_hours || 7),

        anaemia_symptoms: {
          tiredness: form.symptoms.tiredness || 0,
          dizziness: form.symptoms.dizziness || 0,
          hairfall: form.symptoms.hairfall || 0,
        },
        pcod_symptoms: {
          irregular_periods: form.symptoms.irregular_periods || 0,
          acne: form.symptoms.acne || 0,
          pelvic_pain: form.symptoms.pelvic_pain || 0,
        },
      };

      console.log("🚀 SENDING PAYLOAD:", payload);

      const token = localStorage.getItem("auth_token");

      const res = await fetch(`${API_BASE}/combined/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error("Invalid server response");
}

      console.log("✅ RESPONSE:", data);

      if (!res.ok) throw new Error(data.error || "Server error");

      setResult(data);
    } catch (e) {
      console.error("❌ ERROR:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXTRACT SCORES SAFELY ================= */
  const getCombinedScore = () => {
    if (!result) return 0;
    return result.combined_score ?? result.combined_risk_score ?? 0;
  };

  const getAnaemiaScore = () => {
    if (!result) return 0;
    if (result.anaemia?.risk_score !== undefined) {
      return result.anaemia.risk_score;
    }
    return 0;
  };

  const getPCODScore = () => {
    if (!result) return 0;
    if (result.pcod?.risk_score !== undefined) {
      return result.pcod.risk_score;
    }
    return 0;
  };

  const getOverallRisk = () => {
    if (!result) return "Unknown";
    return result.overall_risk ?? result.risk_level ?? "Unknown";
  };

  const getFinalStatus = () => {
    if (!result) return "Processing...";
    return result.final_status ?? result.combined_health_status ?? "Processing...";
  };

  const getHemoglobin = () => {
    if (!result) return "N/A";
    if (result.anaemia?.hemoglobin_value) {
      return result.anaemia.hemoglobin_value;
    }
    if (form.hemoglobin) {
      return `${form.hemoglobin} g/dL`;
    }
    return "N/A";
  };

  const getBMI = () => {
    if (!result) return form.bmi || "N/A";
    if (result.pcod?.bmi) {
      return result.pcod.bmi;
    }
    return form.bmi || "N/A";
  };

  const getAnaemiaRiskLevel = () => {
    if (result?.anaemia?.risk_level) {
      return result.anaemia.risk_level;
    }
    const combined = getCombinedScore();
    if (combined >= 75) return "Critical";
    if (combined >= 50) return "High";
    if (combined >= 25) return "Moderate";
    return "Low";
  };

  const getPCODRiskLevel = () => {
    if (result?.pcod?.risk_level) {
      return result.pcod.risk_level;
    }
    const combined = getCombinedScore();
    if (combined >= 75) return "Critical";
    if (combined >= 50) return "High";
    if (combined >= 25) return "Moderate";
    return "Low";
  };

  /* ================= COLORS ================= */
  const color = useMemo(() => {
    if (!result) return "#8B5CF6";
    const risk = getOverallRisk();
    if (risk === "Critical") return "#DC2626";
    if (risk === "High") return "#DC2626";
    if (risk === "Moderate") return "#F59E0B";
    return "#10B981";
  }, [result]);

  /* ================= SHARED STYLES ================= */

  const pageStyle = {
    minHeight: "100vh",
    padding: "32px 40px 48px",
    background:
      "linear-gradient(135deg, #ffe2f3 0%, #f7d7ff 35%, #f4e7ff 70%, #ffe6f0 100%)",
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

  const headerContentStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const headerIconStyle = { fontSize: 28 };

  const titleStyle = {
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#b416c5",
  };

  const subtitleStyle = {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 24,
    boxShadow:
      "0 20px 40px rgba(148, 27, 147, 0.12), 0 0 0 1px rgba(255,255,255,0.7)",
    backdropFilter: "blur(16px)",
  };

  const sectionTitleStyle = {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
    color: "#4b5563",
  };

  const gridStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
    gap: 18,
  });

  const chipStyle = {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    background:
      "linear-gradient(120deg, rgba(236,72,153,0.09), rgba(129,140,248,0.12))",
    color: "#6b21a8",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  const toggleRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  };

  const checkboxPillStyle = (checked) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    backgroundColor: checked ? "rgba(236,72,153,0.14)" : "rgba(255,255,255,0.9)",
    border: `1px solid ${
      checked ? "rgba(219,39,119,0.6)" : "rgba(209,213,219,0.6)"
    }`,
    fontSize: 13,
    color: "#374151",
    boxShadow: checked
      ? "0 8px 14px rgba(236,72,153,0.28)"
      : "0 3px 6px rgba(148,163,184,0.25)",
    transition: "all 0.18s ease-out",
  });

  const checkboxInputStyle = { accentColor: "#ec4899" };

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

  const sliderLabelText = {
    fontSize: 13,
    fontWeight: 500,
    color: "#4b5563",
  };

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
    background:
      "linear-gradient(90deg, rgba(236,72,153,0.35), rgba(129,140,248,0.6))",
    outline: "none",
  };

  const bottomBarStyle = {
    marginTop: 22,
    display: "flex",
    justifyContent: "center",
  };

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
    background:
      "linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)",
    boxShadow:
      "0 12px 24px rgba(236,72,153,0.45), 0 4px 10px rgba(129,140,248,0.55)",
    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out, filter 0.15s ease-out",
  };

  const errorTextStyle = {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 10,
  };

  const resultCardStyle = {
    marginTop: 26,
    padding: 22,
    borderRadius: 22,
    background: "rgba(255,255,255,0.95)",
    border: `2px solid ${color}`,
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
    backgroundColor: color,
    textTransform: "uppercase",
    letterSpacing: 0.06,
  };

  const scoreStyle = {
    fontSize: 34,
    fontWeight: 800,
    color: "#111827",
  };

  const listTitleStyle = {
    fontSize: 14,
    fontWeight: 600,
    margin: "10px 0 4px",
    color: "#374151",
  };

  const listStyle = {
    paddingLeft: 18,
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 4,
    lineHeight: 1.7,
  };

  const tinyNoteStyle = {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  };

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
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* BACK TO DASHBOARD BUTTON */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => window.location.href = "/dashboard"}
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(180,22,197,0.3)",
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "#b416c5",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(148,163,184,0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b416c5";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(180,22,197,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.color = "#b416c5";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(148,163,184,0.25)";
            }}
          >
            <span>←</span>
            <span>{t.backToDashboard}</span>
          </button>
        </div>

        {/* HEADER - UPDATED WITH LOGO */}
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
                boxShadow: "0 4px 12px rgba(180,22,197,0.3)",
                background: "white",
                padding: "4px"
              }} 
            />
            <div>
              <h1 style={titleStyle}>{t.title}</h1>
              <p style={subtitleStyle}>{t.subtitle}</p>
            </div>
          </div>

          {/* Language Switch Button */}
          <button 
            onClick={() => {
              const next = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
              setLang(next);
              localStorage.setItem("lang", next);
            }}
            style={langButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3E8FF'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <Globe size={18} />
            {lang.toUpperCase()}
          </button>
        </div>

        {/* BASIC DETAILS CARD */}
        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={sectionTitleStyle}>{t.basic}</div>

          <div style={gridStyle(3)}>
            <Input
              label={t.inputs.age}
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
            />
            <Input
              label={t.inputs.height}
              value={form.height}
              onChange={(v) => setForm({ ...form, height: v })}
            />
            <Input
              label={t.inputs.weight}
              value={form.weight}
              onChange={(v) => setForm({ ...form, weight: v })}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <div style={gridStyle(1)}>
              <Input
                label={t.inputs.hemoglobin}
                value={form.hemoglobin}
                onChange={(v) => setForm({ ...form, hemoglobin: v })}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#4b5563" }}>
                {t.bmi}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
                {form.bmi || "0.0"}
              </div>
              <div style={{ marginTop: 6, ...chipStyle }}>
                <span>📊</span>
                <span>{t.bmiAuto}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#4b5563" }}>
              {t.menstrualLifestyle}
            </div>
            <div style={toggleRowStyle}>
              <label style={checkboxPillStyle(form.heavy_periods)}>
                <input
                  type="checkbox"
                  checked={form.heavy_periods}
                  onChange={(e) =>
                    setForm({ ...form, heavy_periods: e.target.checked })
                  }
                  style={checkboxInputStyle}
                />
                <span>{t.heavyBleeding}</span>
              </label>

              <label style={checkboxPillStyle(form.poor_diet)}>
                <input
                  type="checkbox"
                  checked={form.poor_diet}
                  onChange={(e) =>
                    setForm({ ...form, poor_diet: e.target.checked })
                  }
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
          <div style={symptomsGridStyle}>
            {symptomList.map((s) => (
              <div key={s.id} style={symptomCardStyle}>
                <div style={sliderLabelRow}>
                  <span style={sliderLabelText}>
                    {s.icon} {t.symptomLabels[s.id]}
                  </span>
                  <span style={sliderBubbleStyle}>
                    {form.symptoms[s.id] || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.symptoms[s.id] || 0}
                  onChange={(e) => updateSymptom(s.id, Number(e.target.value))}
                  style={rangeStyle}
                />
              </div>
            ))}
          </div>

          {error && <p style={errorTextStyle}>⚠️ {error}</p>}

          <div style={bottomBarStyle}>
            <button
              onClick={analyze}
              disabled={loading}
              style={{
                ...analyzeButtonStyle,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              <span>🔍</span>
              <span>{loading ? t.analyzing : t.analyze}</span>
            </button>
          </div>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div style={resultCardStyle}>
            <div style={resultHeaderRow}>
              <div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>{t.riskLevel}</div>
                <div style={scoreStyle}>{getCombinedScore()}%</div>
              </div>
              <span style={chipRiskStyle}>{getOverallRisk()}</span>
            </div>

            {/* Status Line */}
            <div style={{ marginTop: 4, fontSize: 14, color: "#374151" }}>
              <b>{t.status}:</b> {getFinalStatus()}
            </div>
            <div style={{ marginTop: 2, fontSize: 14, color: "#374151" }}>
              <b>{t.hemoglobin}:</b> {getHemoglobin()}
            </div>
            <div style={{ marginTop: 2, fontSize: 14, color: "#374151" }}>
              <b>{t.bmi}:</b> {getBMI()}
            </div>

            {/* Individual Scores */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: 14,
                  background:
                    "linear-gradient(135deg, rgba(236,72,153,0.08), rgba(219,39,119,0.05))",
                  borderRadius: 14,
                  border: "2px solid rgba(236,72,153,0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  🩸 {t.result.anaemia}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#ec4899",
                    lineHeight: 1,
                  }}
                >
                  {getAnaemiaScore()}%
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {getAnaemiaRiskLevel()}
                </div>
              </div>

              <div
                style={{
                  padding: 14,
                  background:
                    "linear-gradient(135deg, rgba(129,140,248,0.08), rgba(99,102,241,0.05))",
                  borderRadius: 14,
                  border: "2px solid rgba(129,140,248,0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  🌸 {t.result.pcod}
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#818cf8",
                    lineHeight: 1,
                  }}
                >
                  {getPCODScore()}%
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {getPCODRiskLevel()}
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {result.combined_analysis?.all_risk_factors &&
              result.combined_analysis.all_risk_factors.length > 0 && (
                <div>
                  <div style={listTitleStyle}>{t.riskFactors}</div>
                  <ul style={listStyle}>
                    {result.combined_analysis.all_risk_factors.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Recommendations */}
            {((result.combined_analysis?.recommendations &&
              result.combined_analysis.recommendations.length > 0) ||
              (result.recommendations && result.recommendations.length > 0)) && (
              <div>
                <div style={listTitleStyle}>{t.recommendations}</div>
                <ul style={listStyle}>
                  {(result.combined_analysis?.recommendations || result.recommendations || []).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medical Note */}
            <p style={tinyNoteStyle}>
              {result.medical_note ||
                "Supervised ML-based combined screening (not a diagnosis)"}
            </p>

            {/* DOWNLOAD BUTTONS */}
            <div style={{ marginTop: 20, textAlign: "center", display: "flex", gap: 14, justifyContent: "center" }}>
              <button
                onClick={downloadExcel}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 20px rgba(16,185,129,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 16px rgba(16,185,129,0.35)";
                }}
                style={downloadButtonStyle}
              >
                <span>📥</span>
                <span>{t.downloadExcel}</span>
              </button>

              <button
                onClick={downloadMedicalPDF}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 20px rgba(239,68,68,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 16px rgba(239,68,68,0.35)";
                }}
                style={{
                  ...downloadButtonStyle,
                  background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
                }}
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

/* ================= REUSABLE ================= */

const Input = ({ label, value, onChange }) => {
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: "#4b5563",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(209,213,219,0.9)",
    outline: "none",
    fontSize: 14,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
    boxShadow:
      "0 8px 18px rgba(148,163,184,0.32), 0 0 0 1px rgba(255,255,255,0.9)",
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
};
