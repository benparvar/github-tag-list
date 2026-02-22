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

/**
 * Fetch the latest release for a repository using /releases/latest
 * Returns a simplified release object with common fields.
 * options:
 *  - token: GitHub token
 *  - fetchImpl: optional fetch implementation
 */
export async function fetchRepoLatest(owner, repo, options = {}) {
  if (!owner || !repo) throw new Error('owner and repo required');
  const token = options.token || process.env.GITHUB_TOKEN;
  const fetchImpl = options.fetchImpl || defaultFetch;

  const headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `token ${token}`;

  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases/latest`;
  const res = await fetchImpl(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  const rel = await res.json();

  // Simplify assets
  const assets = Array.isArray(rel.assets) ? rel.assets.map(a => ({
    id: a.id,
    name: a.name,
    label: a.label,
    content_type: a.content_type,
    size: a.size,
    download_count: a.download_count,
    browser_download_url: a.browser_download_url
  })) : [];

  return {
    id: rel.id,
    tag_name: rel.tag_name,
    name: rel.name,
    body: rel.body,
    draft: rel.draft,
    prerelease: rel.prerelease,
    created_at: rel.created_at,
    published_at: rel.published_at,
    updated_at: rel.updated_at,
    author: rel.author && ({ login: rel.author.login, id: rel.author.id, html_url: rel.author.html_url }),
    target_commitish: rel.target_commitish,
    tarball_url: rel.tarball_url,
    zipball_url: rel.zipball_url,
    assets,
    html_url: rel.html_url,
    url: rel.url,
  };
}
