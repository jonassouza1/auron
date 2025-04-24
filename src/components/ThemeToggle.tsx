"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const activeTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
      setTheme(activeTheme);
      document.documentElement.classList.add(activeTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="cursor-pointer">
      {theme === "light" ? "🌞" : "🌜"}
    </button>
  );
}
