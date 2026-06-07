import axios from 'axios';

// 배포 환경: VITE_API_URL 환경변수 사용 (예: https://xxx.railway.app/api)
// 개발 환경: Vite 프록시 사용 (/api → http://localhost:8080)
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export default axiosInstance;
