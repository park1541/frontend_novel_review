import { useEffect, useState } from 'react';
import { getMyReviews, deleteReview } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/review/StarRating';
import Spinner from '../components/common/Spinner';
import './MyPage.css';

export default function MyPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    getMyReviews()
      .then((res) => setReviews(res.data?.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;
    await deleteReview(id);
    fetchReviews();
  };

  return (
    <div className="container mypage">
      <h1 className="page-title">마이페이지</h1>
      <div className="mypage-profile">
        <span className="mypage-nickname">{user?.nickname}</span>
        <span className="mypage-role">{user?.role === 'ADMIN' ? '관리자' : '일반 회원'}</span>
      </div>

      <h2 className="section-title">내 리뷰 목록</h2>
      {loading ? (
        <Spinner />
      ) : reviews.length === 0 ? (
        <p className="mypage-empty">작성한 리뷰가 없습니다.</p>
      ) : (
        <div className="mypage-reviews">
          {reviews.map((r) => (
            <div key={r.id} className="mypage-review-item">
              <div className="mypage-review-header">
                <a href={`/novels/${r.novelId}`} className="mypage-novel-title">{r.novelTitle}</a>
                <StarRating value={r.rating} readonly />
              </div>
              <p className="mypage-review-content">{r.content}</p>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>삭제</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
