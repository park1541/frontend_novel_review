import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import NovelListPage from './pages/NovelListPage';
import NovelDetailPage from './pages/NovelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// 앱 전체 라우트 설정
// App이 루트 레이아웃(Header + Footer)을 담당하고,
// children의 각 페이지는 App 내부의 <Outlet /> 위치에 렌더링됨
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 공통 레이아웃 (Header, Footer 포함)
    children: [
      { index: true, element: <Home /> },                    // /
      { path: 'novels', element: <NovelListPage /> },        // /novels
      { path: 'novels/:id', element: <NovelDetailPage /> },  // /novels/1
      { path: 'login', element: <LoginPage /> },             // /login
      { path: 'register', element: <RegisterPage /> },       // /register
      {
        path: 'mypage',
        // ProtectedRoute: 비로그인이면 /login으로 리다이렉트
        element: <ProtectedRoute><MyPage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        // adminOnly: 관리자가 아니면 /로 리다이렉트
        element: <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>,
      },
      { path: '*', element: <NotFoundPage /> },              // 404
    ],
  },
]);

export default router;
