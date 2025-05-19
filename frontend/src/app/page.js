"use client";
import { useEffect, useState } from "react";
  import Loading from "./loading"; // Импортируй свой лоадер

export default function Home() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.username || data.name)) {
          setUsername(data.username || data.name);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />; // Используй свой лоадер
  }

  return (
    <main>
      <h1>Добро пожаловать{username ? `, ${username}` : ""}!</h1>
      <p>Это ваша новая главная страница.</p>
    </main>
  );
}
