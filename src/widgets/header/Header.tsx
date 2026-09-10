import { useEffect, useRef, useState } from "react";
import Avatar from "boring-avatars";
import type { User } from "../../entities/user/model";

type Props = { user: User; title?: string; onCourses: () => void; onAdmin: () => void; onLogout: () => void };

export function Header({ user, title = "Обучение", onCourses, onAdmin, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="site-header">
      <button className="brand" onClick={onCourses}>{title}</button>
      <div className="profile" ref={menuRef}>
        <button className="avatar-button" aria-label="Открыть меню профиля" aria-expanded={open} onClick={() => setOpen(!open)}>
          <Avatar name={user.name} size={42} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} />
        </button>
        {open && (
          <div className="profile-menu">
            <div className="profile-name">{user.name}</div>
            <button onClick={onAdmin}>Админка</button>
            <button onClick={onLogout}>Выход</button>
          </div>
        )}
      </div>
    </header>
  );
}
