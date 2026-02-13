import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH ================= */
import Login from "./app/auth/Login";
import Signup from "./app/auth/Signup";
import AdminLogin from "./app/auth/AdminLogin";
import ProtectedRoute from "./app/auth/ProtectedRoute";

/* ================= CONTEXT ================= */
import { AuthProvider } from "./app/context/AuthContext";
import { HealthProvider } from "./app/context/HealthContext";

/* ================= USER PAGES ================= */
import UserDashboard from "./app/pages/UserDashboard";
import BlockchainRecords from "./app/pages/BlockchainRecords";
import PopulationAnalytics from "./app/pages/PopulationAnalytics";
import Profile from "./app/pages/Profile";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./app/pages/AdminDashboard";

/* ================= HEALTH CHECK PAGES ================= */
import AnemiaCheck from "./app/pages/AnemiaCheck";
import PCODCheck from "./app/pages/PCODCheck";
import CombinedCheck from "./app/pages/CombinedCheck";

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* PUBLIC HEALTH CHECKS */}
            <Route path="/anaemia-check" element={<AnemiaCheck />} />
            <Route path="/pcod-check" element={<PCODCheck />} />
            <Route path="/combined-check" element={<CombinedCheck />} />

            {/* USER PROTECTED */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/blockchain"
              element={
                <ProtectedRoute>
                  <BlockchainRecords />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <PopulationAnalytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ADMIN PROTECTED */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/blockchain"
              element={
                <ProtectedRoute role="admin">
                  <BlockchainRecords />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <PopulationAnalytics />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </HealthProvider>
    </AuthProvider>
  );
}