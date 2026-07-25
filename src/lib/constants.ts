export const GITHUB_USERNAME = "Archibald1948";

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Ruby: "#701516",
  Go: "#00ADD8",
  Shell: "#89e051",
  Java: "#b07219",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  MDX: "#fcb32c",
  PowerShell: "#012456",
  Zig: "#ec915c",
};

export function getLanguageColor(language: string | null): string {
  if (!language) return "#8b8b8b";
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear}년 전`;
  if (diffMonth > 0) return `${diffMonth}달 전`;
  if (diffDay > 0) return `${diffDay}일 전`;
  if (diffHr > 0) return `${diffHr}시간 전`;
  if (diffMin > 0) return `${diffMin}분 전`;
  return "방금 전";
}
