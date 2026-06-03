import axiosInstance from './axiosInstance';

// 로그아웃 요청 (서버에서 JWT 쿠키 삭제)
export const logout = () => axiosInstance.post('/auth/logout');

// 현재 로그인한 사용자 정보 조회 (쿠키로 자동 인증)
export const getMe = () => axiosInstance.get('/auth/me');
