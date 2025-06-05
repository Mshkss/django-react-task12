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
            {course.image_preview && (
              <a href={course.image} target="_blank" rel="noopener noreferrer">
                <img
                  src={course.image_preview}
                  alt={course.title}
                  style={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                    display: "block",
                    marginBottom: "1rem",
                  }}
                />
              </a>
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
