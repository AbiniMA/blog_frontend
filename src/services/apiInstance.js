import axios from "axios";

const BASE_URL = (
  process.env.REACT_APP_API_BASE || "https://blog-backend-9tdd.onrender.com/api/"
).replace(/\/+$/, "");

const apiInstance = axios.create({
  baseURL: BASE_URL,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  const isGoogleLoginRequest =
    config.url && config.url.includes("/user/google-login/");

  if (token && !isGoogleLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiInstance;