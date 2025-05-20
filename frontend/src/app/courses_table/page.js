"use client";
import { useEffect, useState } from "react";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);

  // Фильтры и сортировка
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce эффект
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    // Не сбрасывай courses и не показывай лоадер!
    if (loading) setLoading(false); // только для первой загрузки
    const params = new URLSearchParams({
      limit,
      offset,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(sort ? { ordering: sort } : {}),
    });
    fetch(`http://localhost:8000/api/courses?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.results || []);
        setCount(data.count || 0);
      })
      .catch(() => setCourses([]));
  }, [limit, offset, debouncedSearch, sort]);

  return (
    <div>
      <h2>Таблица курсов</h2>
      {/* Фильтр по названию */}
      <input
        type="text"
        placeholder="Поиск по названию"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOffset(0);
        }}
        style={{ marginBottom: "1rem" }}
      />
      {/* Сортировка */}
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setOffset(0);
        }}
        style={{ marginLeft: "1rem", marginBottom: "1rem" }}
      >
        <option value="">Без сортировки</option>
        <option value="price">Цена ↑</option>
        <option value="-price">Цена ↓</option>
        <option value="title">Название ↑</option>
        <option value="-title">Название ↓</option>
      </select>
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
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setOffset(Math.max(0, offset - limit))}
          disabled={offset === 0}
        >
          Назад
        </button>
        <span style={{ margin: "0 1rem" }}>
          Страница {Math.floor(offset / limit) + 1} из{" "}
          {Math.ceil(count / limit)}
        </span>
        <button
          onClick={() => setOffset(offset + limit)}
          disabled={offset + limit >= count}
        >
          Вперёд
        </button>
      </div>
      <span>
        offset: {offset}, limit: {limit}, count: {count}
      </span>
    </div>
  );
}
