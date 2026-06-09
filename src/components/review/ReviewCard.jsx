import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toggleReviewLike } from '../../api/reviewApi';
import StarRating from './StarRating';
import ReportModal from './ReportModal';
import './ReviewCard.css';

// 리뷰 한 개를 표시하는 카드 컴포넌트
// onDelete: 삭제 버튼 클릭 시 호출 (reviewId 전달)
// onEdit: 수정 버튼 클릭 시 호출 (review 객체 전달)
export default function ReviewCard({ review, onDelete, onEdit }) {
  const { user } = useAuth();

  const [liked, setLiked] = useState(review.liked ?? false);
  const [likeCount, setLikeCount] = useState(review.likeCount ?? 0);
  const [showReportModal, setShowReportModal] = useState(false);

  // 현재 로그인한 사용자가 이 리뷰의 작성자인지 확인
  const isOwner = user && user.id === review.userId;
  // 현재 로그인한 사용자가 관리자인지 확인
  const isAdmin = user && user.role === 'ADMIN';

  // 날짜 문자열을 '2025년 1월 1일' 형식으로 변환
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const res = await toggleReviewLike(review.id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (e) {
      // 오류 무시
    }
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div>
          <span className="review-card-nickname">{review.authorNickname}</span>
          {review.userId && <span className="review-card-user-id">(#{review.userId})</span>}
          <span className="review-card-date">{formatDate(review.createdAt)}</span>
        </div>
        {/* 별점은 조회 전용 (readonly) */}
        <StarRating value={review.rating} readonly />
      </div>

      <p className="review-card-content">{review.content}</p>

      <div className="review-card-footer">
        {/* 좋아요 버튼 */}
        <button
          className={`review-like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          title={user ? '좋아요' : '로그인이 필요합니다'}
        >
          {liked ? '♥' : '♡'} <span className="review-like-count">{likeCount}</span>
        </button>

        <div className="review-card-actions">
          {/* 신고 버튼: 본인 리뷰가 아닌 경우에만 표시 */}
          {!isOwner && (
            <button
              className="btn btn-report btn-sm"
              onClick={() => {
                if (!user) { alert('로그인이 필요합니다.'); return; }
                setShowReportModal(true);
              }}
              title="신고하기"
            >
              🚨 신고
            </button>
          )}
          {/* 본인 또는 관리자에게만 수정/삭제 버튼 표시 */}
          {(isOwner || isAdmin) && (
            <>
              {isOwner && <button className="btn btn-outline btn-sm" onClick={() => onEdit(review)}>수정</button>}
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(review.id)}>삭제</button>
            </>
          )}
        </div>
      </div>

      {showReportModal && (
        <ReportModal reviewId={review.id} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
