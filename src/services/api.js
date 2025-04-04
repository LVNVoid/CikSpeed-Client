import axios from "axios";

const api = axios.create({
  baseURL: "http://18.142.54.194:5000/api",
  withCredentials: true,
});

export default api;
