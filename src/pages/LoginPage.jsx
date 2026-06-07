import './AuthPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export default function LoginPage() {
  const handleGoogle = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  const handleNaver = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/naver`;
  };

  const handleKakao = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-desc">소셜 계정으로 간편하게 로그인하세요</p>
        <div className="social-btn-group">
          <button className="btn-social btn-google" onClick={handleGoogle}>
            구글로 로그인
          </button>
          <button className="btn-social btn-naver" onClick={handleNaver}>
            네이버로 로그인
          </button>
          <button className="btn-social btn-kakao" onClick={handleKakao}>
            카카오로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}
