import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getNovelById } from '../api/novelApi';
import { getReviews, createReview } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/review/StarRating';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import Spinner from '../components/common/Spinner';
import './NovelDetailPage.css';

// 소설 상세 페이지
// URL 파라미터에서 소설 id를 읽어 소설 정보와 리뷰 목록을 함께 표시
export default function NovelDetailPage() {
  const { id } = useParams(); // URL의 :id 값 (예: /novels/3 → id = '3')
  const { user } = useAuth();
  const [novel, setNovel] = useState(null);
  // 리뷰 데이터: content(배열), page(현재 페이지), totalPages(전체 페이지)를 하나의 객체로 관리
  const [reviewData, setReviewData] = useState({ content: [], page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  // 소설 상세 정보 로드
  useEffect(() => {
    getNovelById(id)
      .then((res) => setNovel(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // 리뷰 목록 로드 함수
  // useCallback: id가 바뀌지 않으면 함수를 재생성하지 않음 (불필요한 리렌더 방지)
  const fetchReviews = useCallback((page = 0) => {
    getReviews(id, { page, size: 10 })
      .then((res) => {
        const data = res.data;
        setReviewData({
          content: data?.content ?? [],
          page: data?.page ?? 0,
          totalPages: data?.totalPages ?? 0,
        });
      })
      .catch(() => {});
  }, [id]);

  // 컴포넌트 마운트 시 첫 페이지 리뷰 로드
  useEffect(() => { fetchReviews(0); }, [fetchReviews]);

  // 새 리뷰 작성 후 첫 페이지로 돌아가서 목록 새로고침
  const handleCreateReview = async (data) => {
    await createReview(id, data);
    fetchReviews(0);
  };

  if (loading) return <Spinner />;
  if (!novel) return <p className="detail-error">소설을 찾을 수 없습니다.</p>;

  return (
    <div className="container novel-detail-page">
      {/* 소설 기본 정보 섹션 */}
      <section className="novel-info">
        {/* 표지 이미지 (없으면 이모지 대체) */}
        <div className="novel-info-cover">
          {novel.coverImageUrl ? (
            <img src={novel.coverImageUrl} alt={novel.title} />
          ) : (
            <div className="novel-info-cover-placeholder">📖</div>
          )}
        </div>

        <div className="novel-info-text">
          {novel.genreName && <span className="detail-genre">{novel.genreName}</span>}
          <h1 className="detail-title">{novel.title}</h1>
          <p className="detail-author">{novel.author}</p>

          {/* 평균 별점 (소수점 반올림하여 별로 표시) */}
          <div className="detail-rating">
            <StarRating value={Math.round(novel.averageRating ?? 0)} readonly />
            <span className="detail-rating-num">{novel.averageRating ? Number(novel.averageRating).toFixed(1) : '—'}</span>
            <span className="detail-review-count">({novel.reviewCount ?? 0}개 리뷰)</span>
          </div>

          {novel.description && <p className="detail-synopsis">{novel.description}</p>}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="review-section">
        <h2 className="section-title">리뷰</h2>

        {/* 로그인 상태면 리뷰 작성 폼, 비로그인이면 로그인 안내 */}
        {user ? (
          <ReviewForm onSubmit={handleCreateReview} />
        ) : (
          <p className="review-login-prompt">
            리뷰를 작성하려면 <a href="/login">로그인</a>하세요.
          </p>
        )}

        <div className="review-list-wrap">
          <ReviewList
            reviews={reviewData.content}
            page={reviewData.page}
            totalPages={reviewData.totalPages}
            onPageChange={fetchReviews}                          // 페이지 이동 시 해당 페이지 로드
            onRefresh={() => fetchReviews(reviewData.page)}      // 수정/삭제 후 현재 페이지 새로고침
          />
        </div>
      </section>
    </div>
  );
}
