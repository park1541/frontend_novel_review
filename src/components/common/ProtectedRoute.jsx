import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

// 로그인이 필요한 페이지를 보호하는 컴포넌트
// adminOnly: true이면 관리자 역할(ADMIN)도 추가로 확인
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // 로그인 상태 확인 중에는 스피너 표시 (깜빡임 방지)
  if (loading) return <Spinner />;

  // 비로그인이면 로그인 페이지로 리다이렉트
  if (!user) return <Navigate to="/login" replace />;

  // 관리자 전용 페이지인데 일반 유저가 접근하면 홈으로 리다이렉트
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  // 조건 통과 시 원래 페이지 렌더링
  return children;
}
