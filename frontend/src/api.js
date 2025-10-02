// frontend/src/api.js
import axios from "./api/axiosInstance";

// Helpers opcionales para mantener código limpio en componentes

export async function login(email, password) {
  const { data } = await axios.post("/login", { email, password });
  return data; // { ok, token, user } según tu backend
}

export async function getMe() {
  const { data } = await axios.get("/me");
  return data; // { ok, user } o lo que tu backend retorne
}
