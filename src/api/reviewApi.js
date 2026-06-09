import axiosInstance from './axiosInstance';

// 특정 소설의 리뷰 목록 조회 (page, size 페이지네이션 지원)
export const getReviews = (novelId, params) => axiosInstance.get(`/novels/${novelId}/reviews`, { params });

// 특정 소설에 리뷰 작성 (로그인 필요 / rating, content 전송)
export const createReview = (novelId, data) => axiosInstance.post(`/novels/${novelId}/reviews`, data);

// 내 리뷰 수정 (본인 리뷰만 가능 / rating, content 전송)
export const updateReview = (reviewId, data) => axiosInstance.put(`/reviews/${reviewId}`, data);

// 리뷰 삭제 (본인 또는 관리자만 가능)
export const deleteReview = (reviewId) => axiosInstance.delete(`/reviews/${reviewId}`);

// 내가 작성한 리뷰 전체 조회 (마이페이지에서 사용)
export const getMyReviews = () => axiosInstance.get('/users/me/reviews');

// 리뷰 좋아요 토글 (로그인 필요 / liked, likeCount 반환)
export const toggleReviewLike = (reviewId) => axiosInstance.post(`/reviews/${reviewId}/likes`);

// 리뷰 신고 (로그인 필요 / reason 전송)
export const reportReview = (reviewId, reason) => axiosInstance.post(`/reviews/${reviewId}/reports`, { reason });

// [관리자] 신고 목록 조회
export const getReviewReports = (params) => axiosInstance.get('/admin/review-reports', { params });

// [관리자] 신고 거절 (신고만 삭제)
export const dismissReport = (reportId) => axiosInstance.delete(`/admin/review-reports/${reportId}`);

// [관리자] 신고 처리 (리뷰까지 삭제)
export const deleteReviewByReport = (reportId, reviewId) =>
  axiosInstance.delete(`/admin/review-reports/${reportId}/delete-review/${reviewId}`);
