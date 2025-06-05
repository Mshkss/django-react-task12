"use client";
import { useEffect, useState, useCallback } from "react";
import LoginForm from "../login/page";

export default function ProfilePage() {
  const [username, setUsername] = useState(null);
  const [needLogin, setNeedLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canEditImage, setCanEditImage] = useState(false); // право на редактирование
  const [courseId, setCourseId] = useState(""); // id курса для примера
  const [imageFile, setImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
      // Проверяем право (например, приходит с профилем или отдельным запросом)
      setCanEditImage(data.can_edit_course_image || false);
    } else {
      setNeedLogin(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Функция для отправки изображения
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !courseId) {
      setUploadStatus("Выберите курс и файл.");
      return;
    }
    setUploadStatus("Загрузка...");
    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(
      `http://localhost:8000/api/courses/${courseId}/edit_image/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (res.ok) {
      setUploadStatus("Изображение успешно обновлено!");
    } else {
      setUploadStatus("Ошибка загрузки изображения");
    }
  };

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

      {/* Форма для загрузки изображения курса */}
      {canEditImage && (
        <form onSubmit={handleImageUpload} style={{ marginTop: "2rem" }}>
          <h2>Загрузить новое изображение курса</h2>
          <input
            type="text"
            placeholder="ID курса"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            style={{ marginRight: "1rem" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ marginRight: "1rem" }}
          />
          <button type="submit">Загрузить</button>
          <div>{uploadStatus}</div>
        </form>
      )}
      {canEditImage && (
        <button
          onClick={async () => {
            const token = localStorage.getItem("access");
            const res = await fetch(
              `http://localhost:8000/api/courses/${courseId}/edit_image/`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (res.ok) {
              setUploadStatus("Изображение удалено");
            } else {
              setUploadStatus("Ошибка удаления изображения");
            }
          }}
          disabled={!courseId}
        >
          Удалить изображение
        </button>
      )}
    </main>
  );
}
