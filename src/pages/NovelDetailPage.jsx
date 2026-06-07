import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNovelById } from '../api/novelApi';
import { getReviews, createReview } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/review/StarRating';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import Spinner from '../components/common/Spinner';
import './NovelDetailPage.css';

export default function NovelDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [novel, setNovel] = useState(null);
  const [reviewData, setReviewData] = useState({ content: [], page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    getNovelById(id)
      .then((res) => setNovel(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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

  useEffect(() => { fetchReviews(0); }, [fetchReviews]);

  const handleCreateReview = async (data) => {
    await createReview(id, data);
    fetchReviews(0);
  };

  if (loading) return <Spinner />;
  if (!novel) return <p className="detail-error">소설을 찾을 수 없습니다.</p>;

  const showPlaceholder = !novel.coverImageUrl || imgError;

  return (
    <div className="container novel-detail-page">
      <section className="novel-info">
        <div className="novel-info-cover">
          {!showPlaceholder ? (
            <img
              src={novel.coverImageUrl}
              alt={novel.title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="novel-info-cover-placeholder">
              <span className="placeholder-title">{novel.title}</span>
            </div>
          )}
        </div>

        <div className="novel-info-text">
          {novel.genreName && <span className="detail-genre">{novel.genreName}</span>}
          <h1 className="detail-title">{novel.title}</h1>
          <p className="detail-author">{novel.author}</p>

          <div className="detail-rating">
            <StarRating value={Math.round(novel.averageRating ?? 0)} readonly />
            <span className="detail-rating-num">
              {novel.averageRating ? Number(novel.averageRating).toFixed(1) : '—'}
            </span>
            <span className="detail-review-count">({novel.reviewCount ?? 0}개 리뷰)</span>
          </div>

          {novel.description && <p className="detail-synopsis">{novel.description}</p>}
        </div>
      </section>

      <section className="review-section">
        <h2 className="section-title">리뷰</h2>

        {user ? (
          <ReviewForm onSubmit={handleCreateReview} />
        ) : (
          <div className="review-login-prompt">
            <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
            <Link to="/login" className="login-link-btn">로그인하기</Link>
          </div>
        )}

        <div className="review-list-wrap">
          <ReviewList
            reviews={reviewData.content}
            page={reviewData.page}
            totalPages={reviewData.totalPages}
            onPageChange={fetchReviews}
            onRefresh={() => fetchReviews(reviewData.page)}
          />
        </div>
      </section>
    </div>
  );
}
