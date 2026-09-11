import type { GitHubRepo } from '@/lib/github';
import type { GitHubEvent } from '@/lib/github';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepoCard } from './RepoCard';
import { Activity, BookMarked, Star } from 'lucide-react';
import { ActivityTab } from './ActivityTab';

interface RepoTabsProps {
  username: string;
  repos: GitHubRepo[];
  privateCount: number;
  starred: GitHubRepo[];
  events: GitHubEvent[];
}

export function RepoTabs({
  username,
  repos,
  privateCount,
  starred,
  events,
}: RepoTabsProps) {
  return (
    <Tabs defaultValue="repos" className="w-full">
      <TabsList>
        <TabsTrigger value="repos">
          <BookMarked />
          레포지토리 ({repos.length})
          {privateCount > 0 && (
            <span className="text-muted-foreground">· 비공개 {privateCount}</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="starred">
          <Star />
          스타 ({starred.length})
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Activity />
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="repos" className="mt-4">
        {repos.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            검색 결과가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="starred" className="mt-4">
        {starred.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            검색 결과가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {starred.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <ActivityTab username={username} events={events} />
      </TabsContent>
    </Tabs>
  );
}
