import { useState } from 'react';
import { reportReview } from '../../api/reviewApi';
import './ReportModal.css';

const REASONS = [
  '부적절한 내용',
  '스팸',
  '욕설 / 혐오 표현',
  '기타',
];

export default function ReportModal({ reviewId, onClose }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('신고 이유를 선택해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      await reportReview(reviewId, selectedReason);
      alert('신고가 접수되었습니다.');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 409) {
        alert('이미 신고한 리뷰입니다.');
      } else {
        alert(msg || '신고 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box report-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="report-modal-title">리뷰 신고</h3>
        <p className="report-modal-desc">신고 이유를 선택해주세요.</p>
        <ul className="report-reason-list">
          {REASONS.map((r) => (
            <li key={r}>
              <label className="report-reason-item">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={selectedReason === r}
                  onChange={() => setSelectedReason(r)}
                />
                {r}
              </label>
            </li>
          ))}
        </ul>
        <div className="report-modal-actions">
          <button className="btn btn-outline btn-sm" onClick={onClose}>취소</button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '신고 중...' : '신고하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
