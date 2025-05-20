"use client";
import { useEffect, useState } from "react";
//import Loading from "../loading"; // Импортируй свой лоадер (проверь путь!)

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loadTime, setLoadTime] = useState(null);
  const [loading, setLoading] = useState(true); // 1. состояние загрузки

  useEffect(() => {
    const start = performance.now();
    fetch("http://localhost:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.results || []); // <-- вот тут!
        const end = performance.now();
        setLoadTime((end - start).toFixed(1)); // миллисекунды
        setLoading(false); // 2. Устанавливаем состояние загрузки в false
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    //return <Loading />; // 4. показать лоадер пока идет загрузка
  }
  return (
    <div>
      <h2>Курсы: </h2>
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
      {loadTime && <div>Данные загружены за {loadTime} мс</div>}
    </div>
  );
}
