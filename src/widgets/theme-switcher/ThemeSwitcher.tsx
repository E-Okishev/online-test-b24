import { useEffect, useRef, useState } from "react";

export type ThemeMode = "light" | "dark" | "auto";

const labels: Record<ThemeMode, string> = { light: "Светлая", dark: "Темная", auto: "Авто" };

export function ThemeSwitcher({ value, onChange }: { value: ThemeMode; onChange: (theme: ThemeMode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => !ref.current?.contains(event.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <footer className="site-footer">
      <div className="theme-switcher" ref={ref}>
        <span>Тема:</span>
        <button className="theme-button" aria-expanded={open} onClick={() => setOpen(!open)}>{labels[value]}</button>
        {open && <div className="theme-menu">{(Object.keys(labels) as ThemeMode[]).map((theme) => <button className={theme === value ? "active" : ""} onClick={() => { onChange(theme); setOpen(false); }} key={theme}>{labels[theme]}</button>)}</div>}
      </div>
    </footer>
  );
}
