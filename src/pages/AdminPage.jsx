import { useEffect, useState } from 'react';
import { getNovels } from '../api/novelApi';
import axiosInstance from '../api/axiosInstance';
import { getGenres } from '../api/genreApi';
import Spinner from '../components/common/Spinner';
import './AdminPage.css';

const EMPTY_FORM = { title: '', author: '', genreId: '', synopsis: '', coverUrl: '' };

export default function AdminPage() {
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchNovels = () => {
    setLoading(true);
    getNovels({ page: 0, size: 50 })
      .then((res) => setNovels(res.data.data?.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNovels();
    getGenres().then((res) => setGenres(res.data.data ?? [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (novel) => {
    setEditingId(novel.id);
    setForm({
      title: novel.title,
      author: novel.author,
      genreId: novel.genreId ?? '',
      synopsis: novel.synopsis ?? '',
      coverUrl: novel.coverUrl ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const body = { ...form, genreId: form.genreId ? Number(form.genreId) : null };
      if (editingId) {
        await axiosInstance.put(`/novels/${editingId}`, body);
      } else {
        await axiosInstance.post('/novels', body);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchNovels();
    } catch (err) {
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('소설을 삭제하시겠습니까?')) return;
    await axiosInstance.delete(`/novels/${id}`);
    fetchNovels();
  };

  return (
    <div className="container admin-page">
      <h1 className="page-title">관리자 — 소설 관리</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form-title">{editingId ? '소설 수정' : '소설 추가'}</h2>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>제목 *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>작가 *</label>
            <input name="author" value={form.author} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>장르</label>
            <select name="genreId" value={form.genreId} onChange={handleChange}>
              <option value="">— 선택 안 함 —</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>표지 URL</label>
            <input name="coverUrl" value={form.coverUrl} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label>시놉시스</label>
          <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={3} />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <div className="admin-form-actions">
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>
              취소
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '저장 중...' : editingId ? '수정 완료' : '추가'}
          </button>
        </div>
      </form>

      {loading ? <Spinner /> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>제목</th><th>작가</th><th>장르</th><th>리뷰</th><th>관리</th>
            </tr>
          </thead>
          <tbody>
            {novels.map((n) => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>{n.title}</td>
                <td>{n.author}</td>
                <td>{n.genreName ?? '—'}</td>
                <td>{n.reviewCount ?? 0}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(n)}>수정</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)} style={{ marginLeft: 6 }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
