"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/users/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setResponse(data.message || JSON.stringify(data));
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Регистрация</h2>
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
      <button type="submit">Зарегистрироваться</button>
      {response && <div>Ответ: {response}</div>}
      <div style={{ marginTop: "1em" }}>
        Уже зарегистрированы?{" "}
        <Link href="/login">Войти</Link>
      </div>
    </form>
  );
}
