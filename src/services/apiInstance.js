// import axios from "axios";

// const BASE_URL =
//   (process.env.REACT_APP_API_BASE || "http://localhost:8000/api/").replace(/\/+$/, "");

// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return "";
// };

// const apiInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// apiInstance.interceptors.request.use((config) => {
//   const csrfToken = getCookie("csrftoken");
//   if (csrfToken) {
//     config.headers["X-CSRFToken"] = csrfToken;
//   }
//   return config;
// });

// export default apiInstance;

import axios from "axios";

const BASE_URL = (
  process.env.REACT_APP_API_BASE || "https://blog-backend-9tdd.onrender.com/api/"
).replace(/\/+$/, "");

const apiInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default apiInstance;