import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';
import './ReviewCard.css';

// 리뷰 한 개를 표시하는 카드 컴포넌트
// onDelete: 삭제 버튼 클릭 시 호출 (reviewId 전달)
// onEdit: 수정 버튼 클릭 시 호출 (review 객체 전달)
export default function ReviewCard({ review, onDelete, onEdit }) {
  const { user } = useAuth();

  // 현재 로그인한 사용자가 이 리뷰의 작성자인지 확인
  const isOwner = user && user.id === review.userId;
  // 현재 로그인한 사용자가 관리자인지 확인
  const isAdmin = user && user.role === 'ADMIN';

  // 날짜 문자열을 '2025년 1월 1일' 형식으로 변환
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div>
          <span className="review-card-nickname">{review.nickname}</span>
          <span className="review-card-date">{formatDate(review.createdAt)}</span>
        </div>
        {/* 별점은 조회 전용 (readonly) */}
        <StarRating value={review.rating} readonly />
      </div>

      <p className="review-card-content">{review.content}</p>

      {/* 본인 또는 관리자에게만 수정/삭제 버튼 표시 */}
      {(isOwner || isAdmin) && (
        <div className="review-card-actions">
          {/* 수정 버튼은 본인에게만 표시 (관리자는 삭제만 가능) */}
          {isOwner && <button className="btn btn-outline btn-sm" onClick={() => onEdit(review)}>수정</button>}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(review.id)}>삭제</button>
        </div>
      )}
    </div>
  );
}
