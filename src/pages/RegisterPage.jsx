import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import './AuthPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>닉네임</label>
            <input type="text" name="nickname" value={form.nickname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>
        <p className="auth-link">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </div>
  );
}
