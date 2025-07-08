"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className={styles.wrapper} onClick={toggleTheme} role="button" aria-label="Cambiar tema">
      <div className={`${styles.toggle} ${isDark ? styles.dark : styles.light}`}>
        <span className={styles.icon}>
          {isDark ? <FaMoon /> : <FaSun />}
        </span>
      </div>
    </div>
  );
}
