import axiosInstance from './axiosInstance';

// 소설 목록 조회 (page, size, genreId, keyword 등 쿼리 파라미터 지원)
export const getNovels = (params) => axiosInstance.get('/novels', { params });

// 특정 소설 상세 조회 (id로 단건 조회)
export const getNovelById = (id) => axiosInstance.get(`/novels/${id}`);
