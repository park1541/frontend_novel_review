import { useEffect, useState } from 'react';
import { getPopularSearches } from '../../api/searchApi';
import './PopularSearches.css';

// 인기 검색어 롤링 위젯
// 평소: 현재 순위 1개만 표시, 3초마다 위로 슬라이드 순환
// 호버: 전체 TOP 5 드롭다운 (소설 목록 위에 오버레이)
// onSelect: 키워드 클릭 시 부모에게 검색어 전달
export default function PopularSearches({ onSelect }) {
  const [keywords, setKeywords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    getPopularSearches()
      .then((res) => setKeywords(res.data ?? []))
      .catch(() => {});
  }, []);

  // 3초마다 다음 순위로 슬라이드 (호버 중에는 멈춤)
  useEffect(() => {
    if (keywords.length < 2 || hovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % keywords.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [keywords, hovered]);

  // 검색 기록이 없으면 위젯 숨김
  if (keywords.length === 0) return null;

  return (
    <div
      className="popular-searches"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="popular-label">인기</span>

      {/* 롤링 영역: translateY로 현재 순위 위치로 이동 */}
      <div className="popular-rolling">
        <ul
          className="popular-rolling-list"
          style={{ transform: `translateY(-${current * 28}px)` }}
        >
          {keywords.map((k, i) => (
            <li key={k.keyword}>
              <button className="popular-item" onClick={() => onSelect(k.keyword)}>
                <span className="popular-rank">{i + 1}</span>
                {k.keyword}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 호버 시 전체 TOP 5 드롭다운 */}
      {hovered && (
        <ul className="popular-dropdown">
          {keywords.map((k, i) => (
            <li key={k.keyword}>
              <button className="popular-item" onClick={() => onSelect(k.keyword)}>
                <span className={`popular-rank ${i < 3 ? 'top3' : ''}`}>{i + 1}</span>
                {k.keyword}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
