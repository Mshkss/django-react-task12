import React, { useState } from "react";
import { register } from "../api/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await register(formData);
    setMessage("Registration successful!");
  } catch (error) {
    if (error.response && error.response.data) {
      // Если сервер вернул сообщение об ошибке
      setMessage(
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data)
      );
    } else if (error.request) {
      // Если запрос был отправлен, но ответа нет
      setMessage("No response from server.");
    } else {
      // Если произошла ошибка при настройке запроса
      setMessage("Error: " + error.message);
    }
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <textarea name="bio" placeholder="Bio" onChange={handleChange}></textarea>
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
  );
};
export default Register; // Экспорт по умолчанию