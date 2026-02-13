import { ReactNode, useEffect } from "react";
import React from "react";
interface Props {
  isDark: boolean;
  children: ReactNode;
}

export default function ThemeWrapper({ isDark, children }: Props) {
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-white text-gray-900"
      }`}
    >
      {children}
    </div>
  );
}
