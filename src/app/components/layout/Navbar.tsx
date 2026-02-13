import { useNavigate, useLocation } from "react-router-dom";
import { Activity, Database, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import React from "react";
interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { label: "Health Dashboard", path: "/dashboard", icon: Activity },
    { label: "Blockchain Records", path: "/blockchain", icon: Database },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* BRAND */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            ♥
          </div>
          <span className="text-lg font-semibold text-gray-800 hidden sm:block">
            Women’s Health Intelligence
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-6">
          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 text-sm font-medium ${
                location.pathname === path
                  ? "text-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* USER + LOGOUT */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            👤 {typeof user === "object" && user && "name" in user ? (user as any).name : "User"}
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
