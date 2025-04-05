"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light", // Changed default from "system" to "light"
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Changed default from "system" to "light"
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      // Try to get theme value from local storage
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme) {
        return storedTheme as Theme;
      }
      
      // Removed system preference detection
      // Always default to light theme if nothing is stored
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous class values
    root.classList.remove("light", "dark");
    
    // Apply the appropriate class - modified to handle "system" as "light"
    if (theme === "system") {
      // Always use light theme for "system" setting
      root.classList.add("light");
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Store theme selection in localStorage when it changes
  useEffect(() => {
    if (theme) {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey]);

  // Removed system preference change listener
  // We don't need to listen to system changes anymore

  const value = {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};