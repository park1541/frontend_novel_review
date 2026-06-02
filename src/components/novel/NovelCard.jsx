import { Link } from 'react-router-dom';
import './NovelCard.css';

// 소설 목록에서 한 권을 나타내는 카드 컴포넌트
// 클릭하면 해당 소설 상세 페이지로 이동
export default function NovelCard({ novel }) {
  const { id, title, author, genreName, avgRating, reviewCount, coverUrl } = novel;

  return (
    <Link to={`/novels/${id}`} className="novel-card">
      {/* 표지 이미지 (없으면 책 이모지로 대체) */}
      <div className="novel-card-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={title} />
        ) : (
          <div className="novel-card-cover-placeholder">📖</div>
        )}
      </div>

      {/* 소설 정보 영역 */}
      <div className="novel-card-info">
        {/* 장르 태그 (장르가 있을 때만 표시) */}
        {genreName && <span className="novel-card-genre">{genreName}</span>}
        <h3 className="novel-card-title">{title}</h3>
        <p className="novel-card-author">{author}</p>

        {/* 평균 별점 및 리뷰 수 */}
        <div className="novel-card-rating">
          <span className="star">★</span>
          {/* 리뷰가 없으면 '—' 표시, 있으면 소수점 1자리 */}
          <span>{avgRating ? Number(avgRating).toFixed(1) : '—'}</span>
          {/* ?? 0: reviewCount가 null/undefined이면 0으로 대체 */}
          <span className="novel-card-count">({reviewCount ?? 0}개 리뷰)</span>
        </div>
      </div>
    </Link>
  );
}
