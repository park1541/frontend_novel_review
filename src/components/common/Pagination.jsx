import './Pagination.css';

// 페이지네이션 컴포넌트
// page: 현재 페이지 번호 (0부터 시작)
// totalPages: 전체 페이지 수
// onPageChange: 페이지 버튼 클릭 시 호출되는 함수
export default function Pagination({ page, totalPages, onPageChange }) {
  // 페이지가 1개 이하면 페이지네이션 불필요
  if (totalPages <= 1) return null;

  // 0 ~ totalPages-1 배열 생성 (버튼 렌더링용)
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="pagination">
      {/* 이전 페이지 버튼 (첫 페이지면 비활성화) */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼 (현재 페이지는 active 스타일) */}
      {pages.map((p) => (
        <button
          key={p}
          className={`pagination-btn${p === page ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {/* 다음 페이지 버튼 (마지막 페이지면 비활성화) */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
      >
        &gt;
      </button>
    </div>
  );
}
