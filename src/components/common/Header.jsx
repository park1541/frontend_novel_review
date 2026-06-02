import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/authApi';
import './Header.css';

export default function Header() {
  // 현재 로그인한 사용자 정보와 상태 업데이트 함수 가져오기
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // 로그아웃 처리
  // 서버에 로그아웃 요청 → 쿠키 삭제 → 로컬 상태 초기화 → 홈으로 이동
  const handleLogout = async () => {
    await logout().catch(() => {}); // 서버 오류가 나도 클라이언트는 로그아웃 처리
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        {/* 로고 */}
        <Link to="/" className="header-logo">
          📚 NovelReview
        </Link>

        {/* 상단 네비게이션 링크 */}
        <nav className="header-nav">
          <Link to="/">홈</Link>
          <Link to="/novels">소설 목록</Link>
        </nav>

        {/* 로그인 상태에 따라 다른 버튼 표시 */}
        <div className="header-auth">
          {user ? (
            // 로그인 상태: 마이페이지, 로그아웃 표시 (관리자면 관리자 버튼 추가)
            <>
              {user.role === 'ADMIN' && <Link to="/admin" className="btn btn-outline">관리자</Link>}
              <Link to="/mypage" className="btn btn-outline">마이페이지</Link>
              <button onClick={handleLogout} className="btn btn-primary">로그아웃</button>
            </>
          ) : (
            // 비로그인 상태: 로그인, 회원가입 버튼 표시
            <>
              <Link to="/login" className="btn btn-outline">로그인</Link>
              <Link to="/register" className="btn btn-primary">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
