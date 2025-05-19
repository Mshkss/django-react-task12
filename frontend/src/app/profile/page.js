"use client";
import { useEffect, useState, useCallback } from "react";
import LoginForm from "../login/page";

export default function ProfilePage() {
  const [username, setUsername] = useState(null);
  const [needLogin, setNeedLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Функция для получения профиля
  const fetchProfile = async (token) => {
    return fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // Функция для обновления access-токена
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;
    const res = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    const data = await res.json();
    if (data.access) {
      localStorage.setItem("access", data.access);
      return data.access;
    }
    return null;
  };

  // Основная функция проверки авторизации
  const checkAuth = useCallback(async () => {
    let token = localStorage.getItem("access");
    if (!token) {
      setNeedLogin(true);
      setLoading(false);
      return;
    }

    let res = await fetchProfile(token);

    if (res.status === 401) {
      // Пробуем обновить токен
      token = await refreshToken();
      if (token) {
        res = await fetchProfile(token);
      }
    }

    if (res.ok) {
      const data = await res.json();
      setUsername(data.username || data.name || "Пользователь");
      setNeedLogin(false);
      setLoading(false);
    } else {
      setNeedLogin(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
      <button
        onClick={() => {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUsername(null);
          setNeedLogin(true);
        }}
      >
        Выйти
      </button>
    </main>
  );
}
