import axios from "axios";

/* ================= API CONFIG ================= */

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ FIX: Read from both keys so all components work
    const token = localStorage.getItem("token") || localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
/* 🚫 NEVER redirect here */

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized – clearing auth");
      // ✅ FIX: Clear both token keys
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // ❌ NO window.location.href here
    }
    return Promise.reject(error);
  }
);

/* ================= TYPES ================= */

export interface User {
  id?: number;
  full_name: string;
  roll_no: string;
  age?: number;
  role?: "user" | "admin";
}

export interface LoginPayload {
  identifier: string; // name OR roll number
  password: string;
}

export interface SignupPayload {
  full_name: string;
  roll_no: string;
  age: number;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

/* ================= HELPERS ================= */

/**
 * ✅ FIX: Single helper to store auth data consistently
 * Always clears old data first to prevent stale token bug
 */
const storeAuthData = (token: string, user: User) => {
  // Clear ALL old auth data first (prevents stale admin/user token bug)
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");

  // Store under BOTH keys so all components work regardless of which key they read
  localStorage.setItem("token", token);
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * ✅ FIX: Single helper to clear all auth data
 */
const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

/* ================= AUTH APIs ================= */

/**
 * LOGIN (Name OR Roll Number)
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/login", payload);

  if (res.data?.token && res.data?.user) {
    storeAuthData(res.data.token, res.data.user);
    console.log("✅ Logged in as:", res.data.user.full_name, "| ID:", res.data.user.id);
  }

  return res.data;
};

/**
 * SIGNUP
 */
export const signupUser = async (
  payload: SignupPayload
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/auth/signup", payload);

  if (res.data?.token && res.data?.user) {
    storeAuthData(res.data.token, res.data.user);
    console.log("✅ Signed up as:", res.data.user.full_name, "| ID:", res.data.user.id);
  }

  return res.data;
};

/**
 * LOGOUT
 */
export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (e) {
    console.warn("Logout API failed, clearing local auth");
  } finally {
    clearAuthData();
  }
};

/**
 * GET CURRENT USER FROM STORAGE
 */
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
