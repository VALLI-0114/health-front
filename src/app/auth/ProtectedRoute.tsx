import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: JSX.Element;
  role?: "admin" | "user";
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Give a moment for auth context to initialize
    const timer = setTimeout(() => {
      setChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Double-check with localStorage as fallback
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (!isAuthenticated && !token) {
    console.log("❌ No authentication found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check it
  if (role) {
    let userRole = user?.role;
    
    // Fallback to localStorage if user not in context
    if (!userRole && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        userRole = parsedUser.role;
      } catch (e) {
        console.error("Failed to parse stored user");
      }
    }

    if (userRole !== role) {
      console.log(`❌ Role mismatch. Required: ${role}, Got: ${userRole}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("✅ Access granted");
  return children;
};

export default ProtectedRoute;
