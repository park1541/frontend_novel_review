import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/authApi';

// 전역 인증 상태를 공유하기 위한 Context 생성
const AuthContext = createContext(null);

// 앱 전체를 감싸는 인증 Provider
// - 앱 시작 시 서버에 현재 로그인 상태를 확인
// - user: 로그인한 사용자 정보 (null이면 비로그인)
// - loading: 로그인 상태 확인 중 여부 (확인 전에 화면이 깜빡이는 것 방지)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 첫 렌더링 시 쿠키로 로그인 상태 확인
  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data.data))  // 로그인 상태면 사용자 정보 저장
      .catch(() => setUser(null))              // 401 등 오류면 비로그인 처리
      .finally(() => setLoading(false));       // 확인 완료 → 로딩 해제
  }, []);

  return (
    // user, setUser, loading을 하위 컴포넌트 어디서든 사용할 수 있게 제공
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 인증 상태를 꺼내 쓰는 커스텀 훅
// 사용 예: const { user, setUser } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
