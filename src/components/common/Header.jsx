import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';
import './Header.css';

export default function Header() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout().catch(() => {});
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo">
          📚 NovelReview
        </Link>

        <nav className="header-nav">
          <Link to="/">홈</Link>
          <Link to="/novels">소설 목록</Link>
          <Link to="/rankings">랭킹</Link>
        </nav>

        <div className="header-auth">
          {user ? (
            <>
              {user.role === 'ADMIN' && <Link to="/admin" className="btn btn-outline">관리자</Link>}
              <Link to="/mypage" className="btn btn-outline">마이페이지</Link>
              <button onClick={handleLogout} className="btn btn-primary">로그아웃</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}
