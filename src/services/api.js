import axios from "axios";

const api = axios.create({
  baseURL: "https://18.142.54.194:5000/api",
  withCredentials: true,
});

export default api;
