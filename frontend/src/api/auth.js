import axios from "axios";

const API_URL = "http://localhost:8000/users/";

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}register/`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}login/`, credentials);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axios.post(`${API_URL}token/refresh/`, {
    refresh: refreshToken,
  });
  return response.data;
};
