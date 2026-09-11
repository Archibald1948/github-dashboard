import { GITHUB_USERNAME } from './constants';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload?: {
    action?: string;
  };
}

export async function fetchUser(): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&page=${page}`,
    );
    if (!res.ok) throw new Error('Failed to fetch repos');
    const repos: GitHubRepo[] = await res.json();
    if (repos.length === 0) break;
    allRepos.push(...repos);
    if (repos.length < 100) break;
    page++;
  }

  return allRepos;
}

// Vercel 서버리스 함수(api/private-count.ts)를 통해 비공개 레포 개수만 받아온다.
export async function fetchPrivateRepoCount(): Promise<number> {
  const res = await fetch('/api/private-count');
  if (!res.ok) throw new Error('Failed to fetch private repo count');
  const { privateCount }: { privateCount: number } = await res.json();
  return privateCount;
}

export async function fetchStarred(): Promise<GitHubRepo[]> {
  const allStarred: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=100&page=${page}`,
    );
    if (!res.ok) throw new Error('Failed to fetch starred');
    const repos: GitHubRepo[] = await res.json();
    if (repos.length === 0) break;
    allStarred.push(...repos);
    if (repos.length < 100) break;
    page++;
  }

  return allStarred;
}

export async function fetchPublicEvents(): Promise<GitHubEvent[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
  );
  if (!res.ok) throw new Error('Failed to fetch public events');
  return res.json();
}
