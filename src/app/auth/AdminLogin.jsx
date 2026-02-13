import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_LOGIN_URL = `${API_BASE_URL}/auth/admin-login`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    roll_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.roll_number || !form.password) {
      setError("Enter admin roll number and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 Attempting admin login to:", ADMIN_LOGIN_URL);

      const res = await fetch(ADMIN_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          identifier: form.roll_number,  // ✅ Changed from roll_number to identifier
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Admin login failed. Check credentials.");
        return;
      }

      if (!data.success || !data.token || !data.user) {
        setError("Invalid response from server.");
        return;
      }

      if (data.user.role !== "admin") {
        setError("Not authorized as admin.");
        return;
      }

      // ✅ Map backend fields to frontend expectations
      const userData = {
        id: data.user.id,
        name: data.user.name,
        roll_number: data.user.roll_number,
        role: data.user.role,
      };

      console.log("✅ Admin login successful:", userData);

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      login(userData);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("❌ Admin login error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            ⚙
          </div>
          <h1 className="mt-4 text-xl font-semibold text-gray-800">
            Admin Console Login
          </h1>
          <p className="text-sm text-gray-500">
            Restricted access for authorized administrators.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Admin Roll Number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.roll_number}
            onChange={(e) =>
              setForm({ ...form, roll_number: e.target.value })
            }
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Admin password"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-2 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Admin Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Not an admin?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Go to user login
          </span>
        </div>
      </div>
    </div>
  );
}
