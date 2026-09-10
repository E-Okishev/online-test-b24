import { useState, type FormEvent } from "react";
import Avatar from "boring-avatars";
import type { User } from "../../entities/user/model";
import { login } from "../../entities/user/storage";
import { Button } from "../../shared/ui/Button";

export function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [name, setName] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) onLogin(login(name));
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <Avatar name={name || "Новый студент"} size={72} variant="beam" colors={["#ffad08", "#edd75a", "#73b06f", "#0c8f8f", "#405059"]} />
        <div><h1>Войти в обучение</h1><p>Введите имя, чтобы открыть свой кабинет</p></div>
        <label htmlFor="loginName">Ваше имя</label>
        <input id="loginName" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required autoFocus />
        <Button type="submit">Продолжить</Button>
      </form>
    </main>
  );
}
