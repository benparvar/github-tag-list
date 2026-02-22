import fetchPkg from 'node-fetch';
const defaultFetch = globalThis.fetch || fetchPkg;

/**
 * Fetch repository tags from GitHub API, with simple pagination support.
 * options:
 *  - per_page: number of items per page (default 100)
 *  - token: GitHub token to increase rate limits
 *  - fetchImpl: optional fetch implementation (useful for tests)
 */
export async function fetchRepoTags(owner, repo, options = {}) {
  if (!owner || !repo) throw new Error('owner and repo required');
  const per_page = Number(options.per_page) || 100;
  const token = options.token || process.env.GITHUB_TOKEN;
  const fetchImpl = options.fetchImpl || defaultFetch;

  const headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `token ${token}`;

  async function fetchPage(page) {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tags?per_page=${per_page}&page=${page}`;
    const res = await fetchImpl(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub API error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return data;
  }

  let page = 1;
  let all = [];
  while (true) {
    const data = await fetchPage(page);
    if (!Array.isArray(data)) break;
    all = all.concat(data);
    if (data.length < per_page) break;
    page += 1;
  }

  return all.map(tag => ({ name: tag.name, commitSha: tag.commit?.sha }));
}
