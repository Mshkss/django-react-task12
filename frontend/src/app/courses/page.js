"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loadTime, setLoadTime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = performance.now();
    fetch("http://localhost:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.results || data);
        const end = performance.now();
        setLoadTime((end - start).toFixed(1));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Курсы:</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {courses.map((course) => (
          <li
            key={course.id}
            style={{
              marginBottom: "2rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{course.title}</h3>
            {/* next/image с оптимизацией */}
            {course.image && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "300px",
                  height: "200px",
                  marginBottom: "1rem",
                }}
              >
                <Image
                  src={`${course.image}`}
                  alt={course.title}
                  fill
                  style={{ objectFit: "cover", borderRadius: "6px" }}
                />
              </div>
            )}
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
