import { useState, useEffect } from "react";

// Custom Hook to Manage Theme
export default function useTheme() {
  // Step 1: Detect system theme dynamically
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  // Step 2: Get saved theme or fallback to system preference
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system"; // Default to "system"
  });

  // Step 3: Listen for system theme changes when "system" is selected
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => setTheme("system"); // Trigger re-render when system changes
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Step 4: Sync user-selected theme with localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Step 5: Resolve theme dynamically
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  return { theme, setTheme, resolvedTheme };
}
