"use client";
import { useState } from "react";

export default function NameForm() {
  const [name, setName] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/users/simple/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите имя"
      />
      <button type="submit">Отправить</button>
      {response && <div>Ответ: {response}</div>}
    </form>
  );
}
