import { useEffect, useState } from 'react';
import { getNovels } from '../api/novelApi';
import axiosInstance from '../api/axiosInstance';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../api/genreApi';
import { getReviewReports, dismissReport, deleteReviewByReport } from '../api/reviewApi';
import { getAdminInquiries, answerInquiry, deleteAdminInquiry } from '../api/inquiryApi';
import Spinner from '../components/common/Spinner';
import './AdminPage.css';
import '../components/review/ReportModal.css';

const EMPTY_FORM = { title: '', author: '', genreId: '', description: '', coverImageUrl: '' };

// 사이드바 메뉴 목록 - 추가할 때 여기에만 넣으면 됨
const MENU_ITEMS = [
  { key: 'users',     label: '회원 목록' },
  { key: 'genres',    label: '장르 관리' },
  { key: 'manage',    label: '소설 관리' },
  { key: 'list',      label: '소설 목록' },
  { key: 'reports',   label: '리뷰 신고' },
  { key: 'inquiries', label: '1:1 문의' },
];

export default function AdminPage() {
  const [activeMenu, setActiveMenu] = useState('users');
  const [novels, setNovels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 장르 관리 상태
  const [genreInput, setGenreInput] = useState('');
  const [genreEditingId, setGenreEditingId] = useState(null);
  const [genreError, setGenreError] = useState('');

  // 리뷰 신고 상태
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [expandedContent, setExpandedContent] = useState(null); // 전체 내용 보기

  // 1:1 문의 상태
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [answeringInquiry, setAnsweringInquiry] = useState(null); // 답변 작성 중인 문의
  const [answerText, setAnswerText] = useState('');

  const fetchNovels = () => {
    setLoading(true);
    getNovels({ page: 0, size: 50 })
      .then((res) => setNovels(res.data?.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchUsers = () => {
    setLoading(true);
    axiosInstance.get('/admin/users')
      .then((res) => setUsers(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleBanUser = async (user) => {
    if (!window.confirm(`"${user.nickname}" 회원을 추방하시겠습니까?\n해당 회원의 리뷰가 모두 삭제됩니다.`)) return;
    try {
      await axiosInstance.delete(`/admin/users/${user.id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || '추방 처리 중 오류가 발생했습니다.');
    }
  };

  const fetchReports = () => {
    setReportsLoading(true);
    getReviewReports({ page: 0, size: 50 })
      .then((res) => setReports(res.data?.content ?? []))
      .catch(() => {})
      .finally(() => setReportsLoading(false));
  };

  const fetchInquiries = () => {
    setInquiriesLoading(true);
    getAdminInquiries({ page: 0, size: 50 })
      .then((res) => setInquiries(res.data?.content ?? []))
      .catch(() => {})
      .finally(() => setInquiriesLoading(false));
  };

  useEffect(() => {
    fetchNovels();
    fetchUsers();
    getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
    fetchReports();
    fetchInquiries();
  }, []);

  // 답변 모달 열기 (기존 답변 있으면 수정 모드)
  const openAnswerModal = (inquiry) => {
    setAnsweringInquiry(inquiry);
    setAnswerText(inquiry.answer ?? '');
  };

  const handleDeleteInquiry = async (inq) => {
    if (!window.confirm(`"${inq.title}" 문의를 삭제하시겠습니까?`)) return;
    try {
      await deleteAdminInquiry(inq.id);
      fetchInquiries();
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    try {
      await answerInquiry(answeringInquiry.id, answerText.trim());
      setAnsweringInquiry(null);
      setAnswerText('');
      fetchInquiries();
    } catch {
      alert('답변 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDismissReport = async (reportId) => {
    if (!window.confirm('이 신고를 거절하시겠습니까?')) return;
    try {
      await dismissReport(reportId);
      fetchReports();
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReviewByReport = async (reportId, reviewId) => {
    if (!window.confirm('해당 리뷰를 삭제하시겠습니까?\n리뷰 삭제 시 관련 신고도 모두 사라집니다.')) return;
    try {
      await deleteReviewByReport(reportId, reviewId);
      fetchReports();
    } catch {
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (novel) => {
    setEditingId(novel.id);
    setForm({
      title: novel.title,
      author: novel.author,
      genreId: novel.genreId ?? '',
      description: novel.description ?? '',
      coverImageUrl: novel.coverImageUrl ?? '',
    });
    setActiveMenu('manage');
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
      setActiveMenu('list');
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

  const fetchGenres = () => {
    getGenres().then((res) => setGenres(res.data ?? [])).catch(() => {});
  };

  const handleGenreSubmit = async (e) => {
    e.preventDefault();
    setGenreError('');
    try {
      if (genreEditingId) {
        await updateGenre(genreEditingId, genreInput);
      } else {
        await createGenre(genreInput);
      }
      setGenreInput('');
      setGenreEditingId(null);
      fetchGenres();
    } catch (err) {
      setGenreError(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  const handleGenreEdit = (genre) => {
    setGenreEditingId(genre.id);
    setGenreInput(genre.name);
  };

  const handleGenreDelete = async (id) => {
    if (!window.confirm('장르를 삭제하시겠습니까?')) return;
    try {
      await deleteGenre(id);
      fetchGenres();
    } catch (err) {
      console.log('장르 삭제 에러:', err.response);
      const msg = err.response?.data?.message || err.response?.data || '삭제 중 오류가 발생했습니다.';
      alert(msg);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const providerLabel = (provider) => {
    switch (provider) {
      case 'GOOGLE': return '구글';
      case 'NAVER':  return '네이버';
      case 'KAKAO':  return '카카오';
      default: return provider;
    }
  };

  return (
    <div className="admin-layout">

      {/* 사이드바 */}
      <aside className="admin-sidebar">
        <nav className="admin-sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`admin-sidebar-item ${activeMenu === item.key ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="admin-content">

        {/* 회원 목록 */}
        {activeMenu === 'users' && (
          <div>
            <h1 className="admin-content-title">회원 목록</h1>
            {loading ? <Spinner /> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>닉네임</th>
                    <th>이메일</th>
                    <th>로그인</th>
                    <th>권한</th>
                    <th>가입일</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} className="admin-table-empty">회원이 없습니다.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nickname}</td>
                        <td>{u.email}</td>
                        <td>{providerLabel(u.provider)}</td>
                        <td>
                          <span className={`admin-role-badge ${u.role === 'ADMIN' ? 'admin' : ''}`}>
                            {u.role === 'ADMIN' ? '관리자' : '일반'}
                          </span>
                        </td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td className="admin-table-actions">
                          {u.role !== 'ADMIN' && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleBanUser(u)}>추방</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 장르 관리 */}
        {activeMenu === 'genres' && (
          <div>
            <h1 className="admin-content-title">장르 관리</h1>

            {/* 장르 추가/수정 폼 */}
            <form className="genre-form" onSubmit={handleGenreSubmit}>
              <input
                className="genre-input"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                placeholder="장르 이름 입력"
                required
              />
              <button type="submit" className="btn btn-primary">
                {genreEditingId ? '수정 완료' : '추가'}
              </button>
              {genreEditingId && (
                <button type="button" className="btn btn-outline" onClick={() => { setGenreEditingId(null); setGenreInput(''); }}>
                  취소
                </button>
              )}
            </form>
            {genreError && <p className="auth-error" style={{ marginTop: 8 }}>{genreError}</p>}

            {/* 장르 목록 */}
            <table className="admin-table" style={{ marginTop: 24 }}>
              <thead>
                <tr>
                  <th>장르명</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {genres.length === 0 ? (
                  <tr><td colSpan={2} className="admin-table-empty">등록된 장르가 없습니다.</td></tr>
                ) : (
                  genres.map((g) => (
                    <tr key={g.id}>
                      <td>{g.name}</td>
                      <td className="admin-table-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleGenreEdit(g)}>수정</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleGenreDelete(g.id)}>삭제</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 소설 관리 */}
        {activeMenu === 'manage' && (
          <div>
            <h1 className="admin-content-title">{editingId ? '소설 수정' : '소설 등록'}</h1>
            <form className="admin-form" onSubmit={handleSubmit}>
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
                  <input name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label>작품 소개</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="작품 소개를 입력하세요" />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <div className="admin-form-actions">
                {editingId && (
                  <button type="button" className="btn btn-outline" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>
                    취소
                  </button>
                )}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? '저장 중...' : editingId ? '수정 완료' : '등록'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 소설 목록 */}
        {activeMenu === 'list' && (
          <div>
            <h1 className="admin-content-title">소설 목록</h1>
            {loading ? <Spinner /> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작가</th>
                    <th>장르</th>
                    <th>리뷰</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {novels.length === 0 ? (
                    <tr><td colSpan={5} className="admin-table-empty">등록된 소설이 없습니다.</td></tr>
                  ) : (
                    novels.map((n) => (
                      <tr key={n.id}>
                        <td>{n.title}</td>
                        <td>{n.author}</td>
                        <td>{n.genreName ?? '—'}</td>
                        <td>{n.reviewCount ?? 0}개</td>
                        <td className="admin-table-actions">
                          <button className="btn btn-outline btn-sm" onClick={() => handleEdit(n)}>수정</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>삭제</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 리뷰 신고 */}
        {activeMenu === 'reports' && (
          <div>
            <h1 className="admin-content-title">리뷰 신고 목록</h1>
            {reportsLoading ? <Spinner /> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>신고자</th>
                    <th>신고 이유</th>
                    <th>리뷰 내용</th>
                    <th>신고 날짜</th>
                    <th>처리</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr><td colSpan={5} className="admin-table-empty">신고된 리뷰가 없습니다.</td></tr>
                  ) : (
                    reports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          {r.reporterNickname ?? '탈퇴된 회원'}
                          {r.reporterId && <span className="admin-report-id"> (#{r.reporterId})</span>}
                        </td>
                        <td>{r.reason}</td>
                        <td>
                          <span
                            className="admin-report-content"
                            onClick={() => setExpandedContent(r)}
                            title="클릭하면 전체 내용 보기"
                          >
                            {r.reviewContent
                              ? (r.reviewContent.length > 50
                                  ? r.reviewContent.slice(0, 50) + '...'
                                  : r.reviewContent)
                              : '(삭제된 리뷰)'}
                          </span>
                        </td>
                        <td>{formatDate(r.createdAt)}</td>
                        <td className="admin-table-actions">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteReviewByReport(r.id, r.reviewId)}
                          >
                            리뷰 삭제
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDismissReport(r.id)}
                          >
                            거절
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* 신고된 리뷰 + 소설 정보 모달 */}
            {expandedContent && (
              <div className="modal-overlay" onClick={() => setExpandedContent(null)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                  {/* 소설 정보 */}
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {expandedContent.novelId ? (
                      <a
                        href={`/novels/${expandedContent.novelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary, #7F77DD)', fontWeight: 700, fontSize: '1.05rem' }}
                      >
                        {expandedContent.novelTitle ?? '(제목 없음)'}
                      </a>
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#999' }}>(삭제된 소설)</span>
                    )}
                    {expandedContent.novelGenre && (
                      <span className="admin-role-badge">{expandedContent.novelGenre}</span>
                    )}
                  </div>
                  {expandedContent.novelId && (
                    <p style={{ marginBottom: 16, fontSize: '0.85rem', color: '#666', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {expandedContent.novelDescription || '(소개 없음)'}
                    </p>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 0 14px' }} />

                  {/* 신고된 리뷰 내용 */}
                  <h3 style={{ marginBottom: 8, fontSize: '0.95rem', fontWeight: 700 }}>신고된 리뷰 내용</h3>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.93rem' }}>
                    {expandedContent.reviewContent ?? '(삭제된 리뷰)'}
                  </p>
                  <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setExpandedContent(null)}>닫기</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1:1 문의 */}
        {activeMenu === 'inquiries' && (
          <div>
            <h1 className="admin-content-title">1:1 문의 목록</h1>
            {inquiriesLoading ? <Spinner /> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>유형</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>상태</th>
                    <th>날짜</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <tr><td colSpan={6} className="admin-table-empty">등록된 문의가 없습니다.</td></tr>
                  ) : (
                    inquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td>{inq.category}</td>
                        <td>{inq.title}</td>
                        <td>
                          {inq.userNickname ?? '탈퇴된 회원'}
                          {inq.userId && <span className="admin-report-id"> (#{inq.userId})</span>}
                        </td>
                        <td>
                          <span className={`admin-role-badge ${inq.answer ? 'admin' : ''}`}>
                            {inq.answer ? '답변 완료' : '답변 대기'}
                          </span>
                        </td>
                        <td>{formatDate(inq.createdAt)}</td>
                        <td className="admin-table-actions">
                          <button
                            className={`btn btn-sm ${inq.answer ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => openAnswerModal(inq)}
                          >
                            {inq.answer ? '답변 수정' : '답변 작성'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteInquiry(inq)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* 답변 작성 모달 */}
            {answeringInquiry && (
              <div className="modal-overlay" onClick={() => setAnsweringInquiry(null)}>
                <div className="modal-box" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ marginBottom: 4, fontSize: '1rem', fontWeight: 700 }}>
                    [{answeringInquiry.category}] {answeringInquiry.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)', marginBottom: 12 }}>
                    {answeringInquiry.userNickname} (#{answeringInquiry.userId})
                  </p>
                  <p style={{
                    whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.92rem',
                    background: '#fafafa', padding: '12px 14px', borderRadius: 8, marginBottom: 16,
                  }}>
                    {answeringInquiry.content}
                  </p>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="답변 내용을 입력하세요"
                    rows={5}
                    style={{
                      width: '100%', padding: '10px 14px', fontFamily: 'inherit', fontSize: '0.9rem',
                      border: '1.5px solid var(--color-border)', borderRadius: 8, resize: 'vertical',
                    }}
                  />
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setAnsweringInquiry(null)}>취소</button>
                    <button className="btn btn-primary btn-sm" onClick={handleAnswerSubmit}>
                      {answeringInquiry.answer ? '수정 완료' : '답변 등록'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
