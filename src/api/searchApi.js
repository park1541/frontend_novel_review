import axiosInstance from './axiosInstance';

// 검색어 기록 (검색 실행 시 호출, 실패해도 무시)
export const logSearch = (keyword) => axiosInstance.post('/search-logs', { keyword });

// 인기 검색어 TOP 5 조회 (최근 7일 기준)
export const getPopularSearches = () => axiosInstance.get('/search-logs/popular');
