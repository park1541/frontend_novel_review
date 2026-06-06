# 소설 리뷰 서비스 - 프론트엔드

## 기술 스택
- React 19, React Router v7, Axios, Vite
- 상태관리: Context API + useState
- 스타일: 순수 CSS (CSS 변수)

## 프로젝트 구조
```
src/
├── api/                # Axios API 호출
│   ├── axiosInstance.js   # baseURL: /api, withCredentials: true
│   ├── authApi.js         # getMe, logout, deleteAccount
│   ├── novelApi.js        # getNovels, getNovelById
│   ├── reviewApi.js       # getReviews, createReview, updateReview, deleteReview, getMyReviews
│   └── genreApi.js        # getGenres, createGenre, updateGenre, deleteGenre
├── context/
│   └── AuthContext.jsx    # 전역 인증 상태 (user, setUser, loading)
├── components/
│   ├── common/            # Header, Footer, ProtectedRoute, Pagination, Spinner
│   ├── novel/             # NovelList, NovelCard
│   └── review/            # ReviewForm, ReviewList, ReviewCard, StarRating
└── pages/
    ├── Home.jsx
    ├── LoginPage.jsx      # 소셜 로그인 버튼 3개 (구글/네이버/카카오)
    ├── NovelListPage.jsx  # 장르 필터 + 키워드 검색 + 페이지네이션
    ├── NovelDetailPage.jsx
    ├── MyPage.jsx         # 내 리뷰 목록 + 회원 탈퇴 버튼
    ├── AdminPage.jsx      # 사이드바 레이아웃 (회원목록/장르관리/소설관리/소설목록)
    └── NotFoundPage.jsx
```

## 인증 방식
- 소셜 로그인 (구글/네이버/카카오) → JWT HttpOnly 쿠키
- 로그인 버튼: `window.location.href = 'http://localhost:8080/oauth2/authorization/google'`
- Axios withCredentials: true → 쿠키 자동 포함
- 앱 시작 시 `GET /api/auth/me` 로 로그인 상태 확인

## API 응답 구조
- 백엔드가 `res.data`로 바로 데이터 반환 (res.data.data 아님)
- 목록: `{ content: [], page, size, totalElements, totalPages }`
- 단건: 객체 직접 반환

## 백엔드 연동
- 개발서버: `http://localhost:8080`
- Vite 프록시: `/api` → `http://localhost:8080`

## 주요 필드명 (백엔드 기준)
- 소설: `averageRating`, `coverImageUrl`, `description`, `genreName`
- 리뷰: `authorNickname`, `authorProfileImageUrl`, `novelTitle`, `novelCoverImageUrl`
- 탈퇴 회원 리뷰: `authorNickname = "탈퇴된 회원"`, `authorProfileImageUrl = null`

## 관리자 페이지 구조
- 사이드바 메뉴: `MENU_ITEMS` 배열에 추가하면 자동 반영
- 현재 메뉴: 회원목록 → 장르관리 → 소설관리 → 소설목록
- 회원목록: 일반 회원에게만 "추방" 버튼 표시 (관리자 본인은 버튼 없음)
- ADMIN 권한: DB에서 직접 `UPDATE users SET role = 'ADMIN' WHERE email = '...'`

## 회원 탈퇴 (MyPage.jsx)
- `deleteAccount()` → DELETE /api/users/me
- 성공 시: setUser(null) + navigate('/')
- 리뷰는 삭제되지 않고 "탈퇴된 회원"으로 표시됨

## 관리자 추방 (AdminPage.jsx)
- `axiosInstance.delete('/admin/users/${id}')` → DELETE /api/admin/users/{id}
- 성공 시: 회원 목록 새로고침
- 해당 회원의 리뷰까지 전부 삭제됨

## 개발 서버 실행
```bash
cd C:\study\NovelProject\frontend_novel_review
npm run dev
```
