import axios from "axios";

const api = axios.create({
  baseURL: "https://implemented-occurring-eng-plant.trycloudflare.com/api",
  withCredentials: true,
});

export default api;
