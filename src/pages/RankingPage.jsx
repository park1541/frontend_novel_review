import { useEffect, useState } from 'react';
import { getNovelRankings } from '../api/novelApi';
import { getGenres } from '../api/genreApi';
import NovelCard from '../components/novel/NovelCard';
import Spinner from '../components/common/Spinner';
import './RankingPage.css';

const TYPE_TABS = [
  { key: 'rating',  label: '⭐ 별점 TOP 10' },
  { key: 'reviews', label: '📚 리뷰수 TOP 10' },
];

const PERIOD_TABS = [
  { key: 'all',     label: '전체' },
  { key: 'daily',   label: '일간' },
  { key: 'weekly',  label: '주간' },
  { key: 'monthly', label: '월간' },
];

export default function RankingPage() {
  const [type, setType] = useState('rating');
  const [period, setPeriod] = useState('all');
  const [genreId, setGenreId] = useState(null); // null = 전체 장르
  const [genres, setGenres] = useState([]);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getNovelRankings({ type, period, ...(genreId && { genreId }) })
      .then((res) => setNovels(res.data ?? []))
      .catch(() => setNovels([]))
      .finally(() => setLoading(false));
  }, [type, period, genreId]);

  return (
    <div className="container ranking-page">
      <h1 className="ranking-page-title">🏆 랭킹</h1>

      {/* 기준 탭 */}
      <div className="ranking-type-tabs">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key}
            className={`ranking-type-tab ${type === t.key ? 'active' : ''}`}
            onClick={() => setType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 기간 탭 */}
      <div className="ranking-period-tabs">
        {PERIOD_TABS.map((p) => (
          <button
            key={p.key}
            className={`ranking-period-tab ${period === p.key ? 'active' : ''}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 장르 필터 */}
      <div className="ranking-genre-tabs">
        <button
          className={`ranking-genre-tab ${genreId === null ? 'active' : ''}`}
          onClick={() => setGenreId(null)}
        >
          전체
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            className={`ranking-genre-tab ${genreId === g.id ? 'active' : ''}`}
            onClick={() => setGenreId(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* 랭킹 그리드 */}
      {loading ? <Spinner /> : (
        novels.length === 0 ? (
          <p className="ranking-empty">해당 조건의 소설이 없습니다.</p>
        ) : (
          <div className="ranking-grid">
            {novels.map((novel, index) => (
              <div key={novel.id} className="ranking-item">
                <span className={`ranking-badge ${index < 3 ? 'top3' : ''}`}>{index + 1}</span>
                <NovelCard novel={novel} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
