"use client";
import { useEffect, useState } from "react";
import Loading from "../loading"; // Импортируй свой лоадер (проверь путь!)

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // 1. состояние загрузки

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false)); // 2. Устанавливаем состояние загрузки в false
  }, []);

  return (
    <div>
      <h2>Таблица курсов </h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Цена: {course.price}</p>
            <p>Длительность: {course.duration} часов</p>
            <p>Создан: {new Date(course.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
// 