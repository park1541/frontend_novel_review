import axiosInstance from './axiosInstance';

// 로그인 요청 (이메일, 비밀번호 전송 → 서버에서 JWT 쿠키 발급)
export const login = (data) => axiosInstance.post('/auth/login', data);

// 회원가입 요청 (username, email, password, nickname 전송)
export const register = (data) => axiosInstance.post('/auth/register', data);

// 로그아웃 요청 (서버에서 JWT 쿠키 삭제)
export const logout = () => axiosInstance.post('/auth/logout');

// 현재 로그인한 사용자 정보 조회 (쿠키로 자동 인증)
// 앱 시작 시 로그인 상태 확인에 사용
export const getMe = () => axiosInstance.get('/auth/me');
