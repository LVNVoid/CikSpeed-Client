import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Sesuaikan dengan URL backend
  withCredentials: true, // Mengirim cookie
});

export default api;
