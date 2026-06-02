import NovelCard from './NovelCard';
import './NovelList.css';

export default function NovelList({ novels }) {
  if (!novels || novels.length === 0) {
    return <p className="novel-list-empty">소설이 없습니다.</p>;
  }

  return (
    <div className="novel-list">
      {novels.map((novel) => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}
