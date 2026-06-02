import './StarRating.css';

// 별점 표시 및 선택 컴포넌트
// value: 현재 별점 (1~5)
// onChange: 별점 클릭 시 호출되는 함수
// readonly: true이면 클릭 불가 (조회 전용)
export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className={`star-rating${readonly ? ' readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          // n이 현재 value 이하면 노란색(filled), 초과면 회색
          className={`star-icon${n <= value ? ' filled' : ''}`}
          // readonly가 아닐 때만 클릭 이벤트 실행
          onClick={() => !readonly && onChange?.(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
