import { describe, it, expect, vi } from 'vitest';
import { fetchRepoLatest } from '../src/githubTags.js';

describe('fetchRepoLatest', () => {
  it('returns simplified release object with assets', async () => {
    const mockRel = {
      id: 123,
      tag_name: 'v1.1.0',
      name: 'Release v1.1.0',
      body: 'changes',
      draft: false,
      prerelease: false,
      created_at: '2026-02-22T00:00:00Z',
      published_at: '2026-02-22T00:01:00Z',
      updated_at: '2026-02-22T00:02:00Z',
      author: { login: 'me', id: 1, html_url: 'https://github.com/me' },
      target_commitish: 'main',
      tarball_url: 'https://api.github.com/.../tarball',
      zipball_url: 'https://api.github.com/.../zipball',
      assets: [ { id: 1, name: 'a.zip', label: '', content_type: 'application/zip', size: 10, download_count: 0, browser_download_url: 'https://example.com/a.zip' } ],
      html_url: 'https://github.com/repo/releases/tag/v1.1.0',
      url: 'https://api.github.com/repos/repo/releases/123'
    };

    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockRel });

    const rel = await fetchRepoLatest('owner', 'repo', { fetchImpl: mockFetch });
    expect(rel.tag_name).toBe('v1.1.0');
    expect(rel.assets).toHaveLength(1);
    expect(rel.assets[0].browser_download_url).toBe('https://example.com/a.zip');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/owner/repo/releases/latest'), expect.any(Object));
  });

  it('throws on http error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'Not Found' });
    await expect(fetchRepoLatest('o', 'r', { fetchImpl: mockFetch })).rejects.toThrow(/GitHub API error 404/);
  });

  it('throws if owner or repo missing', async () => {
    await expect(fetchRepoLatest('', '')).rejects.toThrow('owner and repo required');
  });
});
