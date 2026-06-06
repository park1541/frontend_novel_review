import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNovels } from '../api/novelApi';
import { getGenres } from '../api/genreApi';
import NovelList from '../components/novel/NovelList';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import './NovelListPage.css';

// 소설 목록 페이지
// URL 쿼리 파라미터(page, genreId, keyword)로 필터/검색 상태를 관리
// → 뒤로가기, 공유 링크에도 현재 필터 상태가 유지됨
export default function NovelListPage() {
  // useSearchParams: URL의 ?page=0&genreId=1 같은 쿼리 파라미터를 읽고 쓰는 훅
  const [searchParams, setSearchParams] = useSearchParams();
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // URL 쿼리 파라미터에서 현재 필터 값 읽기
  const page = Number(searchParams.get('page') ?? 0);
  const genreId = searchParams.get('genreId') ?? '';
  const keyword = searchParams.get('keyword') ?? '';

  // 장르 목록은 처음 한 번만 로드 (필터 버튼에 사용)
  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data ?? []))
      .catch(() => {});
  }, []);

  // page, genreId, keyword가 바뀔 때마다 소설 목록 다시 로드
  useEffect(() => {
    setLoading(true);
    const params = { page, size: 10 };
    if (genreId) params.genreId = genreId;   // 장르 필터가 있으면 파라미터에 추가
    if (keyword) params.keyword = keyword;   // 검색어가 있으면 파라미터에 추가

    getNovels(params)
      .then((res) => {
        const data = res.data;
        setNovels(data?.content ?? []);      // 소설 배열
        setTotalPages(data?.totalPages ?? 0); // 전체 페이지 수
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, genreId, keyword]);

  // URL 쿼리 파라미터를 업데이트하는 헬퍼 함수
  // 필터를 바꾸면 페이지를 0으로 초기화 (첫 페이지부터 다시 보기)
  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // 필터 변경 시 항상 첫 페이지로 이동
    setSearchParams(next);
  };

  // 검색 폼 제출 처리
  const handleSearch = (e) => {
    e.preventDefault();
    const kw = e.target.keyword.value.trim();
    setParam('keyword', kw);
  };

  return (
    <div className="container novel-list-page">
      <h1 className="page-title">소설 목록</h1>

      <div className="novel-list-filters">
        {/* 장르 필터 버튼 그룹 */}
        <div className="genre-filter">
          {/* '전체' 버튼: genreId를 비워서 필터 해제 */}
          <button
            className={`genre-btn${!genreId ? ' active' : ''}`}
            onClick={() => setParam('genreId', '')}
          >
            전체
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              // 현재 선택된 장르면 active 클래스 추가
              className={`genre-btn${String(genreId) === String(g.id) ? ' active' : ''}`}
              onClick={() => setParam('genreId', g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* 키워드 검색 폼 */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            name="keyword"
            className="search-input"
            placeholder="제목 또는 작가 검색"
            defaultValue={keyword}
          />
          <button type="submit" className="btn btn-primary">검색</button>
        </form>
      </div>

      {/* 로딩 중이면 스피너, 완료되면 목록 + 페이지네이션 */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <NovelList novels={novels} />
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => {
            const next = new URLSearchParams(searchParams);
            next.set('page', p);
            setSearchParams(next);
          }} />
        </>
      )}
    </div>
  );
}
