import axiosInstance from './axiosInstance';

// 장르 목록 전체 조회 (소설 목록 필터 버튼, 관리자 폼 등에서 사용)
export const getGenres = () => axiosInstance.get('/genres');
