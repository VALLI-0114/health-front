import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "./authservice";
import { CheckCircle, Loader2 } from "lucide-react";
import Logo from "../../assets/Logo.jpg";

const translations = {
  en: {
    header: "Create Your Account",
    subHeader: "Women's Health Intelligence Platform",
    placeholders: {
      name: "Full Name",
      roll: "Roll Number / ID",
      age: "Age (5–22)",
      password: "Password (min 6 chars)",
    },
    errors: {
      required: "All fields are required",
      age: "Age must be between 5 and 22",
      failed: "Signup failed. Roll number may already exist.",
    },
    button: {
      signup: "Sign Up",
      creating: "Creating account...",
    },
    success: {
      title: "Signup Successful",
      redirect: "Redirecting to login...",
    },
    footer: {
      text: "Already have an account?",
      login: "Login here",
    },
  },
  te: {
    header: "ఖాతా సృష్టించండి",
    subHeader: "మహిళల ఆరోగ్య మేధస్సు వేదిక",
    placeholders: {
      name: "పూర్తి పేరు",
      roll: "రోల్ నంబర్ / ఐడి",
      age: "వయసు (5–22)",
      password: "పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)",
    },
    errors: {
      required: "అన్ని ఫీల్డ్స్ తప్పనిసరి",
      age: "వయసు 5 నుండి 22 మధ్య ఉండాలి",
      failed: "సైన్ అప్ విఫలమైంది. రోల్ నంబర్ ఇప్పటికే ఉండవచ్చు.",
    },
    button: {
      signup: "సైన్ అప్",
      creating: "ఖాతా సృష్టిస్తోంది...",
    },
    success: {
      title: "సైన్ అప్ విజయవంతం",
      redirect: "లాగిన్‌కు మార్చబడుతోంది...",
    },
    footer: {
      text: "ఇప్పటికే ఖాతా ఉందా?",
      login: "లాగిన్ చేయండి",
    },
  },
  hi: {
    header: "खाता बनाएं",
    subHeader: "महिला स्वास्थ्य बुद्धिमत्ता प्लेटफ़ॉर्म",
    placeholders: {
      name: "पूरा नाम",
      roll: "रोल नंबर / आईडी",
      age: "आयु (5–22)",
      password: "पासवर्ड (कम से कम 6 अक्षर)",
    },
    errors: {
      required: "सभी फ़ील्ड आवश्यक हैं",
      age: "आयु 5 से 22 के बीच होनी चाहिए",
      failed: "साइन अप असफल। रोल नंबर पहले से मौजूद हो सकता है।",
    },
    button: {
      signup: "साइन अप",
      creating: "खाता बनाया जा रहा है...",
    },
    success: {
      title: "साइन अप सफल",
      redirect: "लॉगिन पर ले जाया जा रहा है...",
    },
    footer: {
      text: "पहले से खाता है?",
      login: "यहाँ लॉगिन करें",
    },
  },
};

export default function Signup() {
  const navigate = useNavigate();

  const [lang] = useState(localStorage.getItem("lang") || "en");
  const t = translations[lang];

  const [form, setForm] = useState({
    name: "",
    roll: "",
    age: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    setError("");

    if (!form.name || !form.roll || !form.age || !form.password) {
      setError(t.errors.required);
      return;
    }

    if (+form.age < 5 || +form.age > 22) {
      setError(t.errors.age);
      return;
    }

    if (form.password.length < 6) {
      setError(
        lang === "en"
          ? "Password must be at least 6 characters"
          : lang === "hi"
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"
          : "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి"
      );
      return;
    }

    try {
      setLoading(true);

      await signupUser({
        full_name: form.name,
        roll_no: form.roll,
        age: Number(form.age),
        password: form.password,
        role: "user",
      });

      setForm({ name: "", roll: "", age: "", password: "" });
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err: any) {
      setError(err?.response?.data?.error || t.errors.failed);
    } finally {
      setLoading(false);
    }
  }, [form, loading, lang, t, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-purple-100">

        {/* SUCCESS VIEW */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 animate-fade-in">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
            <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-800 text-center">
              {t.success.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
              {t.success.redirect}
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="text-center mb-5 sm:mb-6">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-md flex items-center justify-center p-2">
                <img
                  src={Logo}
                  alt="Qubito Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-gray-800">
                {t.header}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t.subHeader}
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder={t.placeholders.name}
                value={form.name}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-200"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder={t.placeholders.roll}
                value={form.roll}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-200"
                onChange={(e) =>
                  setForm({ ...form, roll: e.target.value })
                }
              />

              <input
                type="number"
                placeholder={t.placeholders.age}
                value={form.age}
                min={5}
                max={22}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-200"
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value })
                }
              />

              <input
                type="password"
                placeholder={t.placeholders.password}
                value={form.password}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-200"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-2 py-2.5 sm:py-3 rounded-lg text-white text-sm sm:text-base font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.button.creating}
                  </>
                ) : (
                  t.button.signup
                )}
              </button>
            </div>

            {/* FOOTER */}
            <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
              {t.footer.text}{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-600 cursor-pointer hover:underline font-medium"
              >
                {t.footer.login}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
