import axios from 'axios';

// axios 공통 인스턴스 생성
// baseURL: 모든 요청 앞에 '/api'가 자동으로 붙음
// withCredentials: 로그인 쿠키(JWT)를 요청마다 자동으로 포함시킴
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default axiosInstance;
