import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNovels } from '../api/novelApi';
import NovelList from '../components/novel/NovelList';
import Spinner from '../components/common/Spinner';
import './Home.css';

export default function Home() {
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNovels({ page: 0, size: 10 })
      .then((res) => setNovels(res.data?.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">소설을 읽고, 생각을 나누다</h1>
          <p className="hero-sub">수백 권의 소설에 대한 솔직한 리뷰를 만나보세요.</p>
          <Link to="/novels" className="btn btn-primary hero-btn">소설 목록 보기</Link>
        </div>
      </section>

      <section className="home-section container">
        <h2 className="section-title">최근 등록 소설</h2>
        {loading ? <Spinner /> : <NovelList novels={novels} />}
      </section>
    </div>
  );
}
