import { useMounted } from "@/hooks/use-mounted";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", t);
    setTheme(t);
  };

  const mounted = useMounted();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);

  return mounted ? (
    <button
      role="button"
      onClick={toggleTheme}
      className="min-h-[40px] -mr-2 block focus:outline-none"
    >
      <span className="sr-only">Toggle theme mode</span>
      {theme !== "dark" ? (
        <SunIcon className="w-[1.2rem] h-[1.2rem]" />
      ) : (
        <MoonIcon className="w-[1.2rem] h-[1.2rem]" />
      )}
    </button>
  ) : null;
}