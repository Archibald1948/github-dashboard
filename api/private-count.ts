// 토큰 소유자가 가진 비공개 레포 개수만 반환한다. 레포 이름 등 상세 정보는 노출하지 않는다.
// per_page=1로 요청하면 Link 헤더의 last 페이지 번호가 곧 전체 개수가 된다.
const GITHUB_API =
  'https://api.github.com/user/repos?visibility=private&affiliation=owner&per_page=1';

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: 'GITHUB_TOKEN is not set' }, { status: 500 });
  }

  const res = await fetch(GITHUB_API, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    return Response.json(
      { error: 'Failed to fetch private repos' },
      { status: 502 },
    );
  }

  const lastPage = res.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
  const privateCount = lastPage
    ? Number(lastPage[1])
    : ((await res.json()) as unknown[]).length;

  return Response.json(
    { privateCount },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
