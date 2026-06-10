import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import NovelListPage from './pages/NovelListPage';
import NovelDetailPage from './pages/NovelDetailPage';
import RankingPage from './pages/RankingPage';
import InquiryPage from './pages/InquiryPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'novels', element: <NovelListPage /> },
      { path: 'novels/:id', element: <NovelDetailPage /> },
      { path: 'rankings', element: <RankingPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'mypage',
        element: <ProtectedRoute><MyPage /></ProtectedRoute>,
      },
      {
        path: 'inquiries',
        element: <ProtectedRoute><InquiryPage /></ProtectedRoute>,
      },
      {
        path: 'admin',
        element: <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
