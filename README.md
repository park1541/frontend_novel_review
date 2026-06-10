# 소설 리뷰 서비스 - Frontend

소설에 대한 리뷰를 작성하고 공유하는 플랫폼의 프론트엔드입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Router | React Router v7 |
| HTTP | Axios |
| Build | Vite |
| 상태관리 | Context API + useState |
| 스타일 | 순수 CSS (CSS 변수) |
| Deploy | Vercel |

## 주요 기능

- **소셜 로그인**: Google / Naver / Kakao 로그인 (OAuth2)
- **소설 목록**: 장르 필터, 키워드 검색, 페이지네이션 (5열 × 2줄)
- **인기 검색어**: 검색창 옆 TOP 5 롤링 슬라이드 (3초 순환, 호버 시 전체 드롭다운)
- **소설 상세**: 표지 이미지, 평균 별점, 리뷰 목록
- **리뷰**: 작성 / 수정 / 삭제 / 좋아요 토글 (♡ ↔ ♥) / 신고 (이유 선택 모달)
- **랭킹 페이지**: 별점·리뷰수 TOP 10 — 기간(전체/일간/주간/월간) + 장르 필터 탭
- **1:1 문의**: 문의 작성 + 내 문의 내역 (답변 대기/완료 상태, 아코디언)
- **마이페이지**: 내 리뷰 목록, 1:1 문의 진입, 회원 탈퇴
- **관리자**: 회원/장르/소설 관리, 리뷰 신고 처리, 문의 답변·삭제 (ADMIN 권한)

## 프로젝트 구조

```
src/
├── api/
│   ├── axiosInstance.js   # Axios 기본 설정 (baseURL, withCredentials)
│   ├── authApi.js         # 인증 관련 API
│   ├── novelApi.js        # 소설 + 랭킹 API
│   ├── reviewApi.js       # 리뷰 + 좋아요 + 신고 API
│   ├── genreApi.js        # 장르 관련 API
│   ├── searchApi.js       # 검색어 로깅 + 인기 검색어 API
│   └── inquiryApi.js      # 1:1 문의 API
├── context/
│   └── AuthContext.jsx    # 전역 인증 상태 관리
├── components/
│   ├── common/            # Header, Footer, Pagination, Spinner, ProtectedRoute
│   ├── novel/             # NovelCard, NovelList, PopularSearches
│   └── review/            # ReviewCard, ReviewList, ReviewForm, StarRating, ReportModal
└── pages/
    ├── Home.jsx            # 최근 등록 소설
    ├── LoginPage.jsx       # 소셜 로그인 버튼
    ├── NovelListPage.jsx   # 소설 목록 (검색/필터/인기 검색어)
    ├── NovelDetailPage.jsx # 소설 상세 + 리뷰
    ├── RankingPage.jsx     # 랭킹 (기준/기간/장르 탭)
    ├── InquiryPage.jsx     # 1:1 문의 작성 + 내 문의 내역
    ├── MyPage.jsx          # 마이페이지
    ├── AdminPage.jsx       # 관리자 페이지 (사이드바 탭)
    └── NotFoundPage.jsx
```

## 로컬 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정 (선택 - 배포 시 필요)
`.env.local` 파일 생성:
```env
VITE_API_URL=http://localhost:8080/api
VITE_BACKEND_URL=http://localhost:8080
```
> 로컬에서는 Vite 프록시가 자동으로 `/api` → `http://localhost:8080` 으로 연결하므로 환경변수 없이도 동작합니다.

### 3. 개발 서버 실행
```bash
npm run dev
```
접속: `http://localhost:5173`

> 백엔드 서버(`http://localhost:8080`)가 먼저 실행되어 있어야 합니다.

## 배포

- **플랫폼**: Vercel
- **환경변수 설정** (Vercel Dashboard → Settings → Environment Variables):

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://{백엔드 도메인}/api` |
| `VITE_BACKEND_URL` | `https://{백엔드 도메인}` |

## 인증 방식

- 소셜 로그인 버튼 클릭 → 백엔드 OAuth2 엔드포인트로 리다이렉트
- 로그인 성공 시 백엔드에서 JWT를 HttpOnly 쿠키로 발급
- Axios `withCredentials: true` 설정으로 쿠키 자동 포함
- 앱 시작 시 `GET /api/auth/me`로 로그인 상태 확인
