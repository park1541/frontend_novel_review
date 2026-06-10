import axiosInstance from './axiosInstance';

// 문의 작성 (로그인 필요 / category, title, content 전송)
export const createInquiry = (data) => axiosInstance.post('/inquiries', data);

// 내 문의 목록 조회
export const getMyInquiries = () => axiosInstance.get('/users/me/inquiries');

// 문의 삭제 (본인 + 답변 전만 가능)
export const deleteInquiry = (id) => axiosInstance.delete(`/inquiries/${id}`);

// [관리자] 전체 문의 목록
export const getAdminInquiries = (params) => axiosInstance.get('/admin/inquiries', { params });

// [관리자] 답변 등록/수정
export const answerInquiry = (id, answer) => axiosInstance.put(`/admin/inquiries/${id}/answer`, { answer });

// [관리자] 문의 삭제 (답변 여부 상관없이 가능)
export const deleteAdminInquiry = (id) => axiosInstance.delete(`/admin/inquiries/${id}`);
