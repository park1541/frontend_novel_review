import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2025 NovelReview. 소설을 사랑하는 사람들을 위한 공간.</p>
        <Link to="/inquiries" className="footer-link">1:1 문의</Link>
      </div>
    </footer>
  );
}
