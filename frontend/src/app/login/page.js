"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access", data.access);
      if (onLogin) onLogin();
      router.push("/profile");
    } else {
      setError("Ошибка входа");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Вход</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button type="submit">Войти</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ marginTop: "10px" }}>
        Нет аккаунта? <Link href="/registration">Зарегистрироваться</Link>
      </div>
    </form>
  );
}
