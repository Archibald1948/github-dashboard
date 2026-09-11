import { useEffect, useState, useMemo } from 'react';
import type { GitHubUser, GitHubRepo, GitHubEvent } from '@/lib/github';
import {
  fetchUser,
  fetchRepos,
  fetchStarred,
  fetchPublicEvents,
  fetchPrivateRepoCount,
} from '@/lib/github';
import { GITHUB_USERNAME } from '@/lib/constants';
import { ProfileHeader } from '@/components/ProfileHeader';
import { SearchBar } from '@/components/SearchBar';
import { FilterControls, type SortOption } from '@/components/FilterControls';
import { RepoTabs } from '@/components/RepoTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollToTop } from '@/components/ScrollToTop';
import { LightRays } from './components/ui/light-rays';

function LoadingSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-35" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function sortRepos(repos: GitHubRepo[], sort: SortOption): GitHubRepo[] {
  return [...repos].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

function filterRepos(repos: GitHubRepo[], query: string): GitHubRepo[] {
  if (!query.trim()) return repos;
  const q = query.toLowerCase();
  return repos.filter((r) => r.name.toLowerCase().includes(q));
}

export default function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [starred, setStarred] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [privateCount, setPrivateCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('updated');

  useEffect(() => {
    async function load() {
      try {
        const [u, r, s, p] = await Promise.all([
          fetchUser(),
          fetchRepos(),
          fetchStarred(),
          // 서버리스 함수가 없는 로컬 vite dev 등에서는 공개 레포 수만 표시
          fetchPrivateRepoCount().catch(() => 0),
        ]);
        const e = await fetchPublicEvents().catch(() => []);
        setUser(u);
        setRepos(r);
        setStarred(s);
        setPrivateCount(p);
        setEvents(e);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '데이터를 불러올 수 없습니다.',
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRepos = useMemo(
    () => sortRepos(filterRepos(repos, search), sort),
    [repos, search, sort],
  );

  const filteredStarred = useMemo(
    () => sortRepos(filterRepos(starred, search), sort),
    [starred, search, sort],
  );

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <LightRays color="rgba(160, 210, 255, 0.2)" />
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {user && (
          <ProfileHeader
            user={user}
            repoCount={repos.length + privateCount}
            starredCount={starred.length}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterControls sort={sort} onSortChange={setSort} />
        </div>

        <RepoTabs
          username={user?.login ?? GITHUB_USERNAME}
          repos={filteredRepos}
          privateCount={privateCount}
          starred={filteredStarred}
          events={events}
        />
      </div>
      <ScrollToTop />
    </div>
  );
}
