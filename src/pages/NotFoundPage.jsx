import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound">
      <h1 className="notfound-code">404</h1>
      <p className="notfound-msg">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="btn btn-primary">홈으로</Link>
    </div>
  );
}
