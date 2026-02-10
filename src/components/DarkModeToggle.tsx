"use client";

import LocalStorageService from "@/services/LocalStorageService";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const storageService = new LocalStorageService("theme");

export default function DarkModeToggle() {
  // dark mode by default cause people...
  const [darkMode, setDarkMode] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = storageService.load();
    if (saved === "dark" || saved === "light") {
      setDarkMode(saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
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
      className="p-2 rounded-lg hover:bg-base-200"
      aria-label="Toggle dark mode"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
    </button>
  );
}