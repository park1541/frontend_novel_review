import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import './ReviewForm.css';

// 리뷰 작성 / 수정 폼 컴포넌트
// onSubmit: 제출 시 호출되는 함수 (rating, content 전달)
// initialData: 수정 시 기존 리뷰 데이터 (null이면 신규 작성 모드)
// onCancel: 취소 버튼 클릭 시 호출 (수정 모드에서만 전달됨)
export default function ReviewForm({ onSubmit, initialData = null, onCancel }) {
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [content, setContent] = useState(initialData?.content ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 수정 모드에서 initialData가 바뀌면 폼 값을 다시 채워줌
  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사: 별점과 내용이 모두 있어야 제출 가능
    if (rating === 0) { setError('별점을 선택해주세요.'); return; }
    if (!content.trim()) { setError('내용을 입력해주세요.'); return; }

    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ rating, content });
      // 신규 작성 성공 시 폼 초기화 (수정 모드는 부모에서 처리)
      if (!initialData) {
        setRating(0);
        setContent('');
      }
    } catch (err) {
      // 서버 오류 메시지가 있으면 표시, 없으면 기본 메시지
      setError(err.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {/* initialData 여부로 작성/수정 모드 구분 */}
      <h3 className="review-form-title">{initialData ? '리뷰 수정' : '리뷰 작성'}</h3>

      {/* 별점 선택 */}
      <div className="review-form-rating">
        <label>별점</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* 리뷰 내용 입력 */}
      <textarea
        className="review-form-textarea"
        placeholder="소설에 대한 솔직한 리뷰를 작성해주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />

      {/* 오류 메시지 */}
      {error && <p className="review-form-error">{error}</p>}

      <div className="review-form-actions">
        {/* 취소 버튼은 onCancel이 전달된 경우(수정 모드)에만 표시 */}
        {onCancel && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '저장 중...' : initialData ? '수정 완료' : '리뷰 등록'}
        </button>
      </div>
    </form>
  );
}
