import { Link } from 'react-router-dom';
import './NovelCard.css';

export default function NovelCard({ novel }) {
  const { id, title, author, genreName, averageRating, reviewCount, coverImageUrl } = novel;

  return (
    <Link to={`/novels/${id}`} className="novel-card">
      <div className="novel-card-cover">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="novel-card-cover-placeholder" style={{ display: coverImageUrl ? 'none' : 'flex' }}>
          <span className="placeholder-title">{title}</span>
        </div>
      </div>

      <div className="novel-card-info">
        {genreName && <span className="novel-card-genre">{genreName}</span>}
        <h3 className="novel-card-title">{title}</h3>
        <p className="novel-card-author">{author}</p>

        <div className="novel-card-rating">
          <span className="star">★</span>
          <span>{averageRating ? Number(averageRating).toFixed(1) : '—'}</span>
          <span className="novel-card-count">({reviewCount ?? 0}개 리뷰)</span>
        </div>
      </div>
    </Link>
  );
}
