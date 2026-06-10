import { useEffect, useState } from 'react';
import { createInquiry, getMyInquiries, deleteInquiry } from '../api/inquiryApi';
import Spinner from '../components/common/Spinner';
import './InquiryPage.css';

const CATEGORIES = ['소설 등록 요청', '장르 추가 건의', '기능 건의', '기타'];

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null); // 펼쳐진 문의 id

  const [form, setForm] = useState({ category: CATEGORIES[0], title: '', content: '' });

  const fetchInquiries = () => {
    getMyInquiries()
      .then((res) => setInquiries(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createInquiry(form);
      setForm({ category: CATEGORIES[0], title: '', content: '' });
      fetchInquiries();
    } catch (err) {
      setError(err.response?.data?.message || '문의 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('이 문의를 삭제하시겠습니까?')) return;
    try {
      await deleteInquiry(id);
      fetchInquiries();
    } catch (err) {
      alert(err.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="container inquiry-page">
      <h1 className="page-title">1:1 문의</h1>

      {/* 문의 작성 폼 */}
      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="inquiry-form-row">
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            maxLength={200}
            required
          />
        </div>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="문의 내용을 입력하세요"
          rows={5}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <div className="inquiry-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '등록 중...' : '문의 등록'}
          </button>
        </div>
      </form>

      {/* 내 문의 목록 */}
      <h2 className="inquiry-list-title">내 문의 내역</h2>
      {loading ? <Spinner /> : (
        inquiries.length === 0 ? (
          <p className="inquiry-empty">등록한 문의가 없습니다.</p>
        ) : (
          <ul className="inquiry-list">
            {inquiries.map((inq) => (
              <li key={inq.id} className="inquiry-item">
                <button
                  className="inquiry-item-header"
                  onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                >
                  <span className={`inquiry-status ${inq.answer ? 'answered' : ''}`}>
                    {inq.answer ? '답변 완료' : '답변 대기'}
                  </span>
                  <span className="inquiry-category">[{inq.category}]</span>
                  <span className="inquiry-title">{inq.title}</span>
                  <span className="inquiry-date">{formatDate(inq.createdAt)}</span>
                </button>

                {expandedId === inq.id && (
                  <div className="inquiry-item-body">
                    <p className="inquiry-content">{inq.content}</p>

                    {inq.answer ? (
                      <div className="inquiry-answer">
                        <span className="inquiry-answer-label">📩 관리자 답변</span>
                        <p>{inq.answer}</p>
                      </div>
                    ) : (
                      <div className="inquiry-item-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inq.id)}>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
