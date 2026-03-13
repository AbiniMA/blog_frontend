
import axios from 'axios';

const BASE_URL =
  (process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000/api/").replace(/\/+$/, "");

const apiInstance = axios.create({
  baseURL: BASE_URL,
});

export default apiInstance;
