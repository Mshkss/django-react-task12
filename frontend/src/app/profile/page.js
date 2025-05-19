"use client";
import { useEffect, useState } from "react";
import LoginForm from "../login/page"; // Импортируй как компонент

export default function ProfilePage() {
  const [username, setUsername] = useState(null);
  const [needLogin, setNeedLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Функция для повторной проверки авторизации
  const checkAuth = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setNeedLogin(true);
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUsername(data.username || data.name || "Пользователь");
        setNeedLogin(false);
        setLoading(false);
      })
      .catch(() => {
        setNeedLogin(true);
        setLoading(false);
      });
  };

  useEffect(() => {
	console.log("Проверка авторизации");
    checkAuth();
  }, []);

  if (loading) {
    return (
      <main>
        <p>Загрузка...</p>
      </main>
    );
  }

  if (needLogin) {
    return (
      <main>
        <h1>Профиль</h1>
        <p>Вы не авторизованы.</p>
        <LoginForm onLogin={checkAuth} />
      </main>
    );
  }

  return (
    <main>
      <h1>Профиль</h1>
      <p>Здравствуйте, {username}!</p>
    </main>
  );
}