import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Globe } from 'lucide-react';
import Logo from "../../assets/Logo.jpg";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/* ================= INITIAL STATE ================= */
const initialForm = {
  age: "",
  height: "",
  weight: "",
  bmi: "",
  cycle_regularity: "regular",
  cycle_length: "",
  bleeding_days: "",
  symptoms: {},
  weight_gain: false,
  difficulty_losing_weight: false,
  fertility_issues: false,
  pcos_family_history: false,
  stress_level: "moderate",
  sleep_hours: "",
  exercise_frequency: "2-3",
  diet_type: "mixed",
};

export default function PCODCheck() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  // Translations object
  const translations = {
    en: {
      title: "PCOD Risk Detection",
      subtitle: "Cycle-aware screening for early PCOS/PCOD risk assessment.",
      basicDetails: "Basic Health Details",
      age: "Age",
      height: "Height (cm)",
      weight: "Weight (kg)",
      bmi: "BMI",
      bmiAuto: "Auto from height & weight",
      cycleLength: "Cycle Length (days)",
      bleedingDays: "Bleeding Days",
      lifestyleRisk: "Lifestyle & Risk Factors",
      sleepHours: "Sleep hours / day",
      cycleRegularity: "Cycle regularity",
      recentWeightGain: "Recent weight gain",
      difficultyLosingWeight: "Difficulty losing weight",
      fertilityConcerns: "Fertility concerns",
      familyHistory: "Family history of PCOS",
      symptomsSeverity: "Symptoms Severity",
      analyzing: "Analyzing...",
      analyzeButton: "Analyze PCOD Risk",
      overallRisk: "Overall PCOD Risk",
      cyclePattern: "Cycle pattern",
      bleeding: "Bleeding",
      keyRiskFactors: "Key risk factors",
      recommendations: "Recommendations",
      downloadExcel: "Download Analysis Report (Excel)",
      downloadPDF: "Download Medical PDF",
      fillRequired: "Please fill age, height and weight.",
      fillCycle: "Please enter menstrual cycle details.",
      loginRequired: "Please log in to analyze.",
      backToDashboard: "Back to Dashboard",
      
      // Cycle regularity options
      regular: "Regular",
      oftenIrregular: "Often irregular",
      veryIrregular: "Highly irregular",
      
      // Symptoms
      symptomLabels: {
        irregular_periods: "Irregular periods",
        excessive_hair: "Excessive hair growth",
        acne: "Acne",
        hair_loss: "Hair loss",
        dark_skin_patches: "Dark skin patches",
        mood_swings: "Mood swings",
        fatigue: "Fatigue",
        pelvic_pain: "Pelvic pain",
      },
    },
    
    te: {
      title: "PCOD ప్రమాద పరీక్ష",
      subtitle: "ముందస్తు PCOS/PCOD ప్రమాద అంచనా కోసం చక్రం ఆధారిత స్క్రీనింగ్.",
      basicDetails: "ప్రాథమిక ఆరోగ్య వివరాలు",
      age: "వయస్సు",
      height: "ఎత్తు (సెం.మీ)",
      weight: "బరువు (కిలోలు)",
      bmi: "BMI",
      bmiAuto: "ఎత్తు & బరువు నుండి స్వయంచాలకంగా",
      cycleLength: "చక్రం పొడవు (రోజులు)",
      bleedingDays: "రక్తస్రావం రోజులు",
      lifestyleRisk: "జీవనశైలి & ప్రమాద కారకాలు",
      sleepHours: "నిద్ర గంటలు / రోజు",
      cycleRegularity: "చక్రం క్రమబద్ధత",
      recentWeightGain: "ఇటీవల బరువు పెరగడం",
      difficultyLosingWeight: "బరువు తగ్గడంలో కష్టం",
      fertilityConcerns: "సంతానోత్పత్తి ఆందోళనలు",
      familyHistory: "కుటుంబంలో PCOS చరిత్ర",
      symptomsSeverity: "లక్షణాల తీవ్రత",
      analyzing: "విశ్లేషిస్తోంది...",
      analyzeButton: "PCOD ప్రమాదాన్ని విశ్లేషించండి",
      overallRisk: "మొత్తం PCOD ప్రమాద",
      cyclePattern: "చక్రం నమూనా",
      bleeding: "రక్తస్రావం",
      keyRiskFactors: "ముఖ్య ప్రమాద కారకాలు",
      recommendations: "సిఫార్సులు",
      downloadExcel: "విశ్లేషణ నివేదికను డౌన్‌లోడ్ చేయండి (Excel)",
      downloadPDF: "వైద్య PDF డౌన్‌లోడ్ చేయండి",
      fillRequired: "దయచేసి వయస్సు, ఎత్తు మరియు బరువు పూరించండి.",
      fillCycle: "దయచేసి మాసిక ధర్మ చక్రం వివరాలను నమోదు చేయండి.",
      loginRequired: "దయచేసి విశ్లేషించడానికి లాగిన్ చేయండి.",
      backToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
      
      // Cycle regularity options
      regular: "క్రమబద్ధమైన",  
      oftenIrregular: "తరచుగా క్రమరహితమైన",
      veryIrregular: "చాలా క్రమరహితమైన",
      
      // Symptoms
      symptomLabels: {
        irregular_periods: "క్రమరహిత మాసిక ధర్మం",
        excessive_hair: "అధిక జుట్టు పెరుగుదల",
        acne: "మొటిమలు",
        hair_loss: "జుట్టు రాలడం",
        dark_skin_patches: "చీకటి చర్మ మచ్చలు",
        mood_swings: "మానసిక స్థితి మార్పులు",
        fatigue: "అలసట",
        pelvic_pain: "కటి నొప్పి",
      },
    },
    
    hi: {
      title: "PCOD जोखिम पहचान",
      subtitle: "प्रारंभिक PCOS/PCOD जोखिम मूल्यांकन के लिए चक्र-आधारित स्क्रीनिंग।",
      basicDetails: "बुनियादी स्वास्थ्य विवरण",
      age: "आयु",
      height: "ऊंचाई (सेमी)",
      weight: "वजन (किलो)",
      bmi: "BMI",
      bmiAuto: "ऊंचाई और वजन से स्वतः",
      cycleLength: "चक्र लंबाई (दिन)",
      bleedingDays: "रक्तस्राव के दिन",
      lifestyleRisk: "जीवनशैली और जोखिम कारक",
      sleepHours: "नींद के घंटे / दिन",
      cycleRegularity: "चक्र नियमितता",
      recentWeightGain: "हाल में वजन बढ़ना",
      difficultyLosingWeight: "वजन कम करने में कठिनाई",
      fertilityConcerns: "प्रजनन संबंधी चिंताएं",
      familyHistory: "PCOS का पारिवारिक इतिहास",
      symptomsSeverity: "लक्षणों की गंभीरता",
      analyzing: "विश्लेषण हो रहा है...",
      analyzeButton: "PCOD जोखिम का विश्लेषण करें",
      overallRisk: "कुल PCOD जोखिम",
      cyclePattern: "चक्र पैटर्न",
      bleeding: "रक्तस्राव",
      keyRiskFactors: "मुख्य जोखिम कारक",
      recommendations: "सिफारिशें",
      downloadExcel: "विश्लेषण रिपोर्ट डाउनलोड करें (Excel)",
      downloadPDF: "चिकित्सा PDF डाउनलोड करें",
      fillRequired: "कृपया आयु, ऊंचाई और वजन भरें।",
      fillCycle: "कृपया मासिक धर्म चक्र विवरण दर्ज करें।",
      loginRequired: "कृपया विश्लेषण करने के लिए लॉगिन करें।",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      
      // Cycle regularity options
      regular: "नियमित",
      oftenIrregular: "अक्सर अनियमित",
      veryIrregular: "अत्यधिक अनियमित",
      
      // Symptoms
      symptomLabels: {
        irregular_periods: "अनियमित मासिक धर्म",
        excessive_hair: "अत्यधिक बाल उगना",
        acne: "मुंहासे",
        hair_loss: "बालों का झड़ना",
        dark_skin_patches: "त्वचा पर काले धब्बे",
        mood_swings: "मूड में बदलाव",
        fatigue: "थकान",
        pelvic_pain: "श्रोणि क्षेत्र में दर्द",
      },
    },
  };

  const t = translations[lang];

  /* ================= SYMPTOMS ================= */
  const symptomsList = [
    { id: "irregular_periods", icon: "📅", group: "menstrual" },
    { id: "excessive_hair", icon: "🧔", group: "hormonal" },
    { id: "acne", icon: "💊", group: "hormonal" },
    { id: "hair_loss", icon: "🧴", group: "hormonal" },
    { id: "dark_skin_patches", icon: "🌓", group: "metabolic" },
    { id: "mood_swings", icon: "🎭", group: "psychological" },
    { id: "fatigue", icon: "😴", group: "general" },
    { id: "pelvic_pain", icon: "💗", group: "menstrual" },
  ];

  /* ================= BMI AUTO-CALCULATION ================= */
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

  /* ================= SYMPTOM HELPERS ================= */
  const updateSymptom = (id, value) => {
    setForm((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [id]: value },
    }));
  };

  const groupSymptoms = (group) =>
    symptomsList.filter((s) => s.group === group);

  const symptomSummary = {
    menstrual: groupSymptoms("menstrual").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    hormonal: groupSymptoms("hormonal").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    metabolic: groupSymptoms("metabolic").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    psychological: groupSymptoms("psychological").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
    general: groupSymptoms("general").map((s) => ({
      id: s.id,
      label: t.symptomLabels[s.id],
      severity: form.symptoms[s.id] || 0,
    })),
  };

  /* ================= DOWNLOAD EXCEL FUNCTION ================= */
  const downloadExcel = () => {
    if (!result) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = [
      ["PCOD RISK ANALYSIS REPORT"],
      ["Generated on", new Date().toLocaleString()],
      [],
      ["RISK ASSESSMENT"],
      ["Risk Score", `${result.riskscore}%`],
      ["Risk Level", result.risklevel.toUpperCase()],
      [],
      ["PERSONAL HEALTH INFORMATION"],
      ["Age", form.age],
      ["Height (cm)", form.height],
      ["Weight (kg)", form.weight],
      ["BMI", form.bmi],
      ["BMI Status", getBMIStatus(parseFloat(form.bmi))],
      [],
      ["MENSTRUAL CYCLE INFORMATION"],
      ["Cycle Regularity", form.cycle_regularity],
      ["Cycle Length (days)", form.cycle_length],
      ["Bleeding Days", form.bleeding_days],
      [],
      ["LIFESTYLE FACTORS"],
      ["Sleep Hours", form.sleep_hours || "Not specified"],
      ["Exercise Frequency", form.exercise_frequency],
      ["Diet Type", form.diet_type],
      ["Stress Level", form.stress_level],
      [],
      ["RISK FACTORS"],
      ["Recent Weight Gain", form.weight_gain ? "Yes" : "No"],
      ["Difficulty Losing Weight", form.difficulty_losing_weight ? "Yes" : "No"],
      ["Fertility Issues", form.fertility_issues ? "Yes" : "No"],
      ["Family History of PCOS", form.pcos_family_history ? "Yes" : "No"],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 35 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

    // Sheet 2: Symptoms by Category
    const symptomsData = [
      ["SYMPTOMS SEVERITY ASSESSMENT"],
      [],
      ["MENSTRUAL SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.menstrual.map((s) => [s.label, s.severity]),
      [],
      ["HORMONAL SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.hormonal.map((s) => [s.label, s.severity]),
      [],
      ["METABOLIC SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.metabolic.map((s) => [s.label, s.severity]),
      [],
      ["PSYCHOLOGICAL SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.psychological.map((s) => [s.label, s.severity]),
      [],
      ["GENERAL SYMPTOMS"],
      ["Symptom", "Severity (%)"],
      ...symptomSummary.general.map((s) => [s.label, s.severity]),
    ];

    const symptomsWs = XLSX.utils.aoa_to_sheet(symptomsData);
    symptomsWs["!cols"] = [{ wch: 40 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, symptomsWs, "Symptoms");

    // Sheet 3: Analysis & Recommendations
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
      [
        "This assessment is for educational purposes and should not replace professional medical advice. Please consult with a qualified gynecologist for diagnosis and treatment.",
      ],
    ];

    const analysisWs = XLSX.utils.aoa_to_sheet(analysisData);
    analysisWs["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, analysisWs, "Analysis");

    // Sheet 4: Detailed Metrics
    const metricsData = [
      ["DETAILED HEALTH METRICS"],
      [],
      ["Health Parameter", "Value", "Status/Notes"],
      ["BMI", form.bmi, getBMIStatus(parseFloat(form.bmi))],
      ["Age", form.age, "Recorded"],
      ["Cycle Length", form.cycle_length, getCycleLengthStatus(parseInt(form.cycle_length))],
      ["Bleeding Duration", form.bleeding_days, getBleedingStatus(parseInt(form.bleeding_days))],
      ["Cycle Regularity", form.cycle_regularity, form.cycle_regularity === "regular" ? "Normal" : "Irregular"],
      [],
      ["LIFESTYLE ASSESSMENT"],
      ["Sleep Hours", form.sleep_hours || "Not specified", getSleepStatus(parseFloat(form.sleep_hours))],
      ["Exercise", form.exercise_frequency, "Recorded"],
      ["Diet Type", form.diet_type, "Recorded"],
      ["Stress Level", form.stress_level, "Recorded"],
      [],
      ["RISK INDICATORS"],
      ["Weight Gain", form.weight_gain ? "Yes ⚠️" : "No", ""],
      ["Weight Loss Difficulty", form.difficulty_losing_weight ? "Yes ⚠️" : "No", ""],
      ["Fertility Concerns", form.fertility_issues ? "Yes ⚠️" : "No", ""],
      ["Family History", form.pcos_family_history ? "Yes ⚠️" : "No", ""],
      [],
      ["ASSESSMENT DATE", new Date().toLocaleDateString(), ""],
    ];

    const metricsWs = XLSX.utils.aoa_to_sheet(metricsData);
    metricsWs["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, metricsWs, "Metrics");

    // Generate filename with timestamp
    const filename = `PCOD_Analysis_${new Date()
      .toISOString()
      .slice(0, 10)}_${new Date().getHours()}-${new Date().getMinutes()}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  /* ================= DOWNLOAD MEDICAL PDF FUNCTION ================= */
  const downloadMedicalPDF = () => {
    if (!result) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(236, 72, 153);
    doc.rect(0, 0, 210, 22, "F");
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("PCOD MEDICAL ASSESSMENT REPORT", 105, 14, { align: "center" });

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
        ["BMI Status", getBMIStatus(parseFloat(form.bmi))],
        ["Cycle Regularity", form.cycle_regularity],
        ["Cycle Length", `${form.cycle_length} days`],
        ["Bleeding Days", form.bleeding_days],
      ],
    });

    let y = doc.lastAutoTable.finalY + 10;

    // Risk Assessment
    doc.setFontSize(14);
    doc.text("Risk Assessment", 14, y);
    doc.setFontSize(24);
    doc.text(`${result.riskscore}%`, 14, y + 12);
    doc.setFontSize(12);
    doc.text(`Risk Level: ${result.risklevel.toUpperCase()}`, 14, y + 22);

    // Lifestyle Factors
    y += 34;
    doc.setFontSize(14);
    doc.text("Lifestyle Factors", 14, y);
    doc.setFontSize(11);
    const lifestyleFactors = [
      `Sleep: ${form.sleep_hours || "Not specified"} hours/day`,
      `Exercise: ${form.exercise_frequency} times/week`,
      `Diet Type: ${form.diet_type}`,
      `Stress Level: ${form.stress_level}`,
    ];
    lifestyleFactors.forEach((item, i) => {
      doc.text(`• ${item}`, 16, y + 8 + i * 6);
    });

    // Risk Factors
    y = y + 14 + lifestyleFactors.length * 6;
    doc.setFontSize(14);
    doc.text("Identified Risk Factors", 14, y);
    doc.setFontSize(11);
    result.riskfactors.forEach((r, i) => {
      doc.text(`• ${r}`, 16, y + 8 + i * 6);
    });

    // Recommendations
    y = y + 14 + result.riskfactors.length * 6;
    doc.setFontSize(14);
    doc.text("Medical Recommendations", 14, y);
    doc.setFontSize(11);
    result.recommendations.forEach((r, i) => {
      doc.text(`• ${r}`, 16, y + 8 + i * 6);
    });

    // Medical Note
    y = y + 14 + result.recommendations.length * 6;
    doc.setFontSize(12);
    doc.text("Medical Note", 14, y);
    doc.setFontSize(10);
    doc.text(result.medicalnote, 14, y + 8, { maxWidth: 180 });

    // Disclaimer
    y += 26;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "⚠️ Disclaimer: This AI-generated report is for screening purposes only and does not replace professional gynecological diagnosis.",
      14,
      y,
      { maxWidth: 180 }
    );

    doc.save(`PCOD_Medical_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* ================= HELPER FUNCTIONS ================= */
  const getBMIStatus = (bmi) => {
    if (!bmi || bmi === 0) return "Not calculated";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getCycleLengthStatus = (length) => {
    if (!length) return "Not specified";
    if (length < 21) return "Short cycle";
    if (length <= 35) return "Normal range";
    return "Long cycle";
  };

  const getBleedingStatus = (days) => {
    if (!days) return "Not specified";
    if (days < 2) return "Very short";
    if (days <= 7) return "Normal range";
    return "Prolonged";
  };

  const getSleepStatus = (hours) => {
    if (!hours) return "Not specified";
    if (hours < 6) return "Insufficient";
    if (hours <= 9) return "Adequate";
    return "Excessive";
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.age || !form.height || !form.weight) {
      return t.fillRequired;
    }
    if (!form.cycle_length || !form.bleeding_days) {
      return t.fillCycle;
    }
    return null;
  };

  /* ================= API CALL (🔥 COMPLETELY FIXED) ================= */
  const analyzeData = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    // 🔥 CRITICAL FIX 1: Check token FIRST before doing anything
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
    
    if (!token) {
      console.error("❌ No auth token found - stopping execution");
      setError(t.loginRequired);
      setLoading(false);
      
      // Give user time to read the error message
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
      return; // 🔥 STOP HERE - don't continue to fetch
    }

    // Token exists - proceed with analysis
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🔑 Auth token found:", token.substring(0, 20) + "...");

      // Build payload - flatten symptoms to top level AND keep nested
      const payload = {
        age: parseInt(form.age),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        bmi: parseFloat(form.bmi),
        cycle_regularity: form.cycle_regularity,
        cycle_length: parseInt(form.cycle_length),
        bleeding_days: parseInt(form.bleeding_days),
        weight_gain: form.weight_gain,
        difficulty_losing_weight: form.difficulty_losing_weight,
        fertility_issues: form.fertility_issues,
        pcos_family_history: form.pcos_family_history,
        stress_level: form.stress_level,
        sleep_hours: parseFloat(form.sleep_hours) || 0,
        exercise_frequency: form.exercise_frequency,
        diet_type: form.diet_type,
        
        // Include symptoms both nested AND at top level for maximum compatibility
        symptoms: form.symptoms,
        
        // Also add symptoms at top level
        irregular_periods: form.symptoms.irregular_periods || 0,
        excessive_hair: form.symptoms.excessive_hair || 0,
        acne: form.symptoms.acne || 0,
        hair_loss: form.symptoms.hair_loss || 0,
        dark_skin_patches: form.symptoms.dark_skin_patches || 0,
        mood_swings: form.symptoms.mood_swings || 0,
        fatigue: form.symptoms.fatigue || 0,
        pelvic_pain: form.symptoms.pelvic_pain || 0,
      };

      console.log("🚀 PCOD CHECK - Sending payload to:", `${API_BASE}/pcod/check`);
      console.log("📦 Payload preview:", {
        age: payload.age,
        bmi: payload.bmi,
        cycle_length: payload.cycle_length,
        symptoms_count: Object.keys(payload.symptoms).length
      });

      const res = await fetch(`${API_BASE}/pcod/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // 🔥 Always send token
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", res.status, res.statusText);

      // 🔥 CRITICAL FIX 2: Handle 401/403 BEFORE parsing JSON
      if (res.status === 401 || res.status === 403) {
        console.error("❌ Authentication failed - token invalid or expired");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
        setLoading(false);
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        
        return; // 🔥 STOP HERE
      }

      const text = await res.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  throw new Error("Invalid server response");
}
      console.log("📥 Response data:", data);

      if (!res.ok) {
        console.error("❌ Error response:", data);
        throw new Error(data.error || data.message || `Server error: ${res.status}`);
      }

      // 🔥 CRITICAL FIX 3: Backend response structure is FLAT, not nested
      // Backend returns: { success: true, check_id: 13, user_name: "aradhya", ... }
      // NOT: { database: { saved: true, check_id: 13 }, ... }
      
      if (!data.success) {
        console.warn("⚠️ Response indicates failure");
        throw new Error(data.error || "Analysis failed");
      }

      // ✅ FIX: Extract data from FLAT response structure
      setResult({
        riskscore: Math.round(data.risk_score || 0),
        risklevel: data.risk_level || "Unknown",
        recommendations: data.recommendations || [],
        riskfactors: data.risk_factors || [],
        medicalnote: data.medical_note || "Consult a gynecologist for further evaluation.",
        timestamp: data.timestamp || new Date().toISOString(),
        userName: data.user_name,  // ✅ Direct field
        checkId: data.check_id,    // ✅ Direct field, not nested
        dbSaved: true,             // ✅ If we got here, it was saved
      });

      console.log("✅ Result set successfully");
      console.log("   - User:", data.user_name);
      console.log("   - Check ID:", data.check_id);
      console.log("   - DB Saved: true");
      
      // Clear error since everything worked
      setError(null);

    } catch (err) {
      console.error("❌ PCOD CHECK ERROR:", err);
      console.error("Error stack:", err.stack);
      setError(err.message || "Unable to analyze data. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RISK COLOR ================= */
  const riskColor = (level) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "#10B981";
      case "moderate":
        return "#F59E0B";
      case "high":
        return "#DC2626";
      case "critical":
        return "#7F1D1D";
      default:
        return "#6B7280";
    }
  };

  /* ================= STYLES (UNCHANGED) ================= */
  const pageStyle = {
    minHeight: "100vh",
    padding: "32px 40px 48px",
    background:
      "linear-gradient(135deg, #ffe2f3 0%, #f7d7ff 35%, #f4e7ff 70%, #ffe6f0 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
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

  const grid3Style = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: 18,
  };

  const grid2Style = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0,1fr))",
    gap: 18,
  };

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
    backgroundColor: checked
      ? "rgba(236,72,153,0.14)"
      : "rgba(255,255,255,0.9)",
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
    transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
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
  };

  const tinyNoteStyle = {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 6,
  };

  const metaRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 8,
    marginBottom: 12,
    fontSize: 13,
    color: "#4b5563",
  };

  const pillMetaStyle = {
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(243,244,246,0.9)",
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

  // Get cycle regularity options with translations
  const cycleRegularityOptions = [
    { value: "regular", label: t.regular },
    { value: "often_irregular", label: t.oftenIrregular },
    { value: "very_irregular", label: t.veryIrregular },
  ];

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* BACK TO DASHBOARD BUTTON */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => window.location.href = "/dashboard"}
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(236,72,153,0.3)",
              borderRadius: 12,
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              color: "#ec4899",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 12px rgba(148,163,184,0.25)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ec4899";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(236,72,153,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              e.currentTarget.style.color = "#ec4899";
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
                boxShadow: "0 4px 12px rgba(236,72,153,0.3)",
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

        {/* BASIC + MENSTRUAL CARD */}
        <div style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={sectionTitleStyle}>{t.basicDetails}</div>
          <div style={grid3Style}>
            <Input
              label={t.age}
              value={form.age}
              onChange={(v) => setForm({ ...form, age: v })}
            />
            <Input
              label={t.height}
              value={form.height}
              onChange={(v) => setForm({ ...form, height: v })}
            />
            <Input
              label={t.weight}
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
            <div style={grid2Style}>
              <Input
                label={t.cycleLength}
                value={form.cycle_length}
                onChange={(v) => setForm({ ...form, cycle_length: v })}
              />
              <Input
                label={t.bleedingDays}
                value={form.bleeding_days}
                onChange={(v) => setForm({ ...form, bleeding_days: v })}
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
        </div>

        {/* LIFESTYLE + SYMPTOMS CARD */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>{t.lifestyleRisk}</div>
          <div style={grid2Style}>
            <Input
              label={t.sleepHours}
              value={form.sleep_hours}
              onChange={(v) => setForm({ ...form, sleep_hours: v })}
            />
            <Select
              label={t.cycleRegularity}
              value={form.cycle_regularity}
              onChange={(v) => setForm({ ...form, cycle_regularity: v })}
              options={cycleRegularityOptions}
            />
          </div>

          <div style={toggleRowStyle}>
            <label style={checkboxPillStyle(form.weight_gain)}>
              <input
                type="checkbox"
                checked={form.weight_gain}
                onChange={(e) =>
                  setForm({ ...form, weight_gain: e.target.checked })
                }
                style={checkboxInputStyle}
              />
              <span>{t.recentWeightGain}</span>
            </label>

            <label style={checkboxPillStyle(form.difficulty_losing_weight)}>
              <input
                type="checkbox"
                checked={form.difficulty_losing_weight}
                onChange={(e) =>
                  setForm({
                    ...form,
                    difficulty_losing_weight: e.target.checked,
                  })
                }
                style={checkboxInputStyle}
              />
              <span>{t.difficultyLosingWeight}</span>
            </label>

            <label style={checkboxPillStyle(form.fertility_issues)}>
              <input
                type="checkbox"
                checked={form.fertility_issues}
                onChange={(e) =>
                  setForm({ ...form, fertility_issues: e.target.checked })
                }
                style={checkboxInputStyle}
              />
              <span>{t.fertilityConcerns}</span>
            </label>

            <label style={checkboxPillStyle(form.pcos_family_history)}>
              <input
                type="checkbox"
                checked={form.pcos_family_history}
                onChange={(e) =>
                  setForm({ ...form, pcos_family_history: e.target.checked })
                }
                style={checkboxInputStyle}
              />
              <span>{t.familyHistory}</span>
            </label>
          </div>

          <div style={{ ...sectionTitleStyle, marginTop: 18 }}>
            {t.symptomsSeverity}
          </div>

          <div style={symptomsGridStyle}>
            {symptomsList.map((s) => (
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
                  onChange={(e) =>
                    updateSymptom(s.id, parseInt(e.target.value, 10))
                  }
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
              style={{
                ...analyzeButtonStyle,
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
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
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {t.overallRisk}
                </div>
                <div style={scoreStyle}>{result.riskscore}%</div>
                {/* ✅ FIXED: Display userName confirmation */}
                {result.userName && (
                  <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                    ✅ Saved for: <b style={{ color: "#b416c5" }}>{result.userName}</b>
                  </div>
                )}
                {/* ✅ Show check ID if available */}
                {result.checkId && (
                  <div style={{ marginTop: 2, fontSize: 11, color: "#9ca3af" }}>
                    Check ID: {result.checkId}
                  </div>
                )}
              </div>
              <span style={chipRiskStyle}>{result.risklevel}</span>
            </div>

            <div style={metaRowStyle}>
              <span style={pillMetaStyle}>
                <b>{t.cyclePattern}:</b> {form.cycle_regularity}
              </span>
              <span style={pillMetaStyle}>
                <b>{t.cycleLength}:</b> {form.cycle_length || "-"} {lang === "en" ? "days" : lang === "te" ? "రోజులు" : "दिन"}
              </span>
              <span style={pillMetaStyle}>
                <b>{t.bleeding}:</b> {form.bleeding_days || "-"} {lang === "en" ? "days" : lang === "te" ? "రోజులు" : "दिन"}
              </span>
              <span style={pillMetaStyle}>
                <b>{t.bmi}:</b> {form.bmi}
              </span>
            </div>

            <div>
              <div style={listTitleStyle}>{t.keyRiskFactors}</div>
              <ul style={listStyle}>
                {result.riskfactors.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={listTitleStyle}>{t.recommendations}</div>
              <ul style={listStyle}>
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <p style={tinyNoteStyle}>{result.medicalnote}</p>

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

/* ================= REUSABLE COMPONENTS ================= */

function Input({ label, value, onChange }) {
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
}

function Select({ label, value, onChange, options }) {
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

  const selectStyle = {
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
