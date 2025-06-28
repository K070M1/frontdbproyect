import axios from "axios";

const BACKEND_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
