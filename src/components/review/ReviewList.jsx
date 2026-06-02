import { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import Pagination from '../common/Pagination';
import { deleteReview, updateReview } from '../../api/reviewApi';
import './ReviewList.css';

// 리뷰 목록 컴포넌트
// onRefresh: 리뷰 수정/삭제 후 목록을 다시 불러오는 함수
export default function ReviewList({ reviews, page, totalPages, onPageChange, onRefresh }) {
  // 현재 수정 중인 리뷰 객체 (null이면 수정 모드 아님)
  const [editingReview, setEditingReview] = useState(null);

  // 리뷰 삭제 처리
  const handleDelete = async (reviewId) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;
    await deleteReview(reviewId);
    onRefresh(); // 삭제 후 목록 새로고침
  };

  // 리뷰 수정 제출 처리
  const handleEditSubmit = async (data) => {
    await updateReview(editingReview.id, data);
    setEditingReview(null); // 수정 폼 닫기
    onRefresh();            // 수정 후 목록 새로고침
  };

  // 리뷰가 없을 때 안내 메시지 표시
  if (!reviews || reviews.length === 0) {
    return <p className="review-list-empty">아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</p>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) =>
        // 현재 수정 중인 리뷰면 ReviewForm으로, 아니면 ReviewCard로 렌더링
        editingReview?.id === review.id ? (
          <ReviewForm
            key={review.id}
            initialData={editingReview}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingReview(null)}
          />
        ) : (
          <ReviewCard
            key={review.id}
            review={review}
            onDelete={handleDelete}
            onEdit={setEditingReview} // 수정 버튼 클릭 시 해당 리뷰를 editingReview로 설정
          />
        )
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
