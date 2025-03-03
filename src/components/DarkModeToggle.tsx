"use client";

import { getStorageKey } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  // dark mode by default cause people...
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem(getStorageKey("theme"));
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(getStorageKey("theme"), "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem(getStorageKey("theme"), "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      {darkMode ? "Dark Mode" : "Light Mode"}
    </button>
  );
}