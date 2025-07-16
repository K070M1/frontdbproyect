import axios from "axios";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // necesario para incluir cookies (ej. token JWT)
});

export default api;
