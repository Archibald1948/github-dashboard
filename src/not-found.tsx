import { Link } from 'react-router';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
      <p className="mb-8 max-w-md text-center font-mono text-sm md:text-base text-muted-foreground">
        앗! <br />
        찾으시는 페이지가 없거나 이동되었습니다.
      </p>
      <button className="flex flex-col items-center gap-4 bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
        <Link to="/">홈으로 돌아가기</Link>
      </button>
    </main>
  );
}
