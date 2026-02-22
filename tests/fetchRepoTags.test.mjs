import { vi, describe, it, expect } from 'vitest';
import { fetchRepoTags } from '../src/githubTags.js';

describe('fetchRepoTags', () => {
  it('returns mapped tags', async () => {
    const mockResponse = [{ name: 'v1.0.0', commit: { sha: 'abc' } }];
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse });

    const tags = await fetchRepoTags('owner', 'repo', { fetchImpl: mockFetch });
    expect(tags).toEqual([{ name: 'v1.0.0', commitSha: 'abc' }]);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/owner/repo/tags'), expect.any(Object));
  });

  it('throws on http error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'Not Found' });
    await expect(fetchRepoTags('o', 'r', { fetchImpl: mockFetch })).rejects.toThrow(/GitHub API error 404/);
  });

  it('throws if owner or repo missing', async () => {
    await expect(fetchRepoTags('', '')).rejects.toThrow('owner and repo required');
  });

  it('paginates until no more results', async () => {
    const mockFetch = vi.fn((url) => {
      const page = new URL(url).searchParams.get('page');
      if (page === '1') return Promise.resolve({ ok: true, json: async () => [{ name: 'v1', commit: { sha: 'a' } }] });
      if (page === '2') return Promise.resolve({ ok: true, json: async () => [{ name: 'v2', commit: { sha: 'b' } }] });
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    const tags = await fetchRepoTags('o', 'r', { per_page: 1, fetchImpl: mockFetch });
    expect(tags).toEqual([{ name: 'v1', commitSha: 'a' }, { name: 'v2', commitSha: 'b' }]);
    expect(mockFetch).toHaveBeenCalled();
  });
});
