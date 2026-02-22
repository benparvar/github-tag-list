import { fetchRepoTags } from '../src/githubTags.js';

describe('fetchRepoTags', () => {
  it('returns mapped tags', async () => {
    const mockResponse = [{ name: 'v1.0.0', commit: { sha: 'abc' } }];
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockResponse });

    const tags = await fetchRepoTags('owner', 'repo', { fetchImpl: mockFetch });
    expect(tags).toEqual([{ name: 'v1.0.0', commitSha: 'abc' }]);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/owner/repo/tags'), expect.any(Object));
  });

  it('throws on http error', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: false, status: 404, text: async () => 'Not Found' });
    await expect(fetchRepoTags('o', 'r', { fetchImpl: mockFetch })).rejects.toThrow('GitHub API error 404: Not Found');
  });

  it('throws if owner or repo missing', async () => {
    await expect(fetchRepoTags('', '')).rejects.toThrow();
  });

  it('paginates until no more results', async () => {
    const mockFetch = jest.fn((url) => {
      if (url.includes('page=1')) return Promise.resolve({ ok: true, json: async () => [{ name: 'v1', commit: { sha: 'a' } }] });
      if (url.includes('page=2')) return Promise.resolve({ ok: true, json: async () => [{ name: 'v2', commit: { sha: 'b' } }] });
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    const tags = await fetchRepoTags('o', 'r', { per_page: 1, fetchImpl: mockFetch });
    expect(tags).toEqual([{ name: 'v1', commitSha: 'a' }, { name: 'v2', commitSha: 'b' }]);
    expect(mockFetch).toHaveBeenCalled();
  });
});
