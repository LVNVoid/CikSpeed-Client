import axios from "axios";
import https from "https";

const api = axios.create({
  baseURL: "https://18.142.54.194:5000/api",
  withCredentials: true,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export default api;
