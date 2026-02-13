import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authservice";
import { useAuth } from "../context/AuthContext";
import { Globe, Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/Logo.jpg";

/* -----------------------------
   Translation Types
------------------------------ */
type TranslationKeys = {
  title: string;
  subtitle: string;
  identifier: string;
  password: string;
  login: string;
  empty: string;
  invalid: string;
  adminHint: string;
  adminLink: string;
  newUser: string;
  create: string;
  loggingIn: string;
};

/* -----------------------------
   Translations
------------------------------ */
const translations: Record<string, TranslationKeys> = {
  en: {
    title: "Women's Health Intelligence",
    subtitle: "Secure Login for Health Monitoring",
    identifier: "Name / Roll Number",
    password: "Password",
    login: "Login",
    empty: "Please fill in all fields",
    invalid: "Invalid credentials",
    adminHint: "Admin user?",
    adminLink: "Go to admin login",
    newUser: "New user?",
    create: "Create an account",
    loggingIn: "Logging in...",
  },
  te: {
    title: "మహిళల ఆరోగ్య మేధస్సు",
    subtitle: "ఆరోగ్య పర్యవేక్షణ కోసం సురక్షిత లాగిన్",
    identifier: "పేరు / రోల్ నంబర్",
    password: "పాస్‌వర్డ్",
    login: "లాగిన్",
    empty: "దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి",
    invalid: "చెల్లని ఆధారాలు",
    adminHint: "అడ్మిన్ యూజర్?",
    adminLink: "అడ్మిన్ లాగిన్‌కు వెళ్లండి",
    newUser: "కొత్త వినియోగదారు?",
    create: "ఖాతా సృష్టించండి",
    loggingIn: "లాగిన్ అవుతోంది...",
  },
  hi: {
    title: "महिला स्वास्थ्य बुद्धिमत्ता",
    subtitle: "स्वास्थ्य निगरानी के लिए सुरक्षित लॉगिन",
    identifier: "नाम / रोल नंबर",
    password: "पासवर्ड",
    login: "लॉगिन",
    empty: "कृपया सभी फ़ील्ड भरें",
    invalid: "अमान्य क्रेडेंशियल",
    adminHint: "एडमिन यूजर?",
    adminLink: "एडमिन लॉगिन पर जाएं",
    newUser: "नया उपयोगकर्ता?",
    create: "खाता बनाएं",
    loggingIn: "लॉगिन हो रहा है...",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* -----------------------------
     Language handling
  ------------------------------ */
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const t = translations[lang] || translations.en;

  /* -----------------------------
     State
  ------------------------------ */
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* -----------------------------
     Language toggle handler
  ------------------------------ */
  const handleLanguageToggle = () => {
    const nextLang = lang === "en" ? "te" : lang === "te" ? "hi" : "en";
    setLang(nextLang);
    localStorage.setItem("lang", nextLang);
  };

  /* -----------------------------
     Submit Handler
  ------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      setError(t.empty);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await loginUser({
        identifier: form.identifier,
        password: form.password,
      });

      login(res.user);

      navigate(
        res.user.role === "admin" ? "/admin" : "/dashboard",
        { replace: true }
      );

    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(t.invalid); // Proper translated message
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Debug lifecycle
  ------------------------------ */
  useEffect(() => {
    console.log("🎨 Login mounted");
    return () => console.log("🎨 Login unmounted");
  }, []);

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative">

        {/* Language Toggle Button - Top Right */}
        <button
          onClick={handleLanguageToggle}
          disabled={loading}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Change Language"
        >
          <Globe size={16} />
          <span className="font-semibold">{lang.toUpperCase()}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center p-2">
            <img
              src={Logo}
              alt="Qubito Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-800">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder={t.identifier}
            value={form.identifier}
            onChange={(e) =>
              setForm({ ...form, identifier: e.target.value })
            }
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.password}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? t.loggingIn : t.login}
          </button>

          <div className="text-center text-xs text-gray-500">
            {t.adminHint}{" "}
            <span
              onClick={() => !loading && navigate("/admin/login")}
              className="text-purple-600 cursor-pointer hover:underline font-medium"
            >
              {t.adminLink}
            </span>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {t.newUser}{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 cursor-pointer hover:underline font-medium"
          >
            {t.create}
          </span>
        </div>

      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}