"use client";

import LocalStorageService from "@/services/LocalStorageService";
import { useEffect, useState } from "react";

const storageService = new LocalStorageService("theme");

export default function DarkModeToggle() {
  // dark mode by default cause people...
  const [darkMode, setDarkMode] = useState(() => {
    return storageService.load() || false;
  });

  useEffect(() => {
    const savedTheme = storageService.load();
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode === "dark") {
      document.documentElement.classList.remove("dark");
      storageService.save("light");
    } else {
      document.documentElement.classList.add("dark");
      storageService.save("dark");
    }
    setDarkMode(darkMode === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      {darkMode === "dark" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}