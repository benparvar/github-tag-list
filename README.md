# github-tag-list
Simple code to list GitHub tags using the GitHub API

## Install

```bash
npm install
```

## Usage

Run the CLI with owner and repo. Use `--latest` (or `-l`) to print the latest release:

```bash
# list tags
node src/index.js <owner> <repo>
# example:
node src/index.js benparvar github-tag-list

# print latest release JSON
node src/index.js --latest <owner> <repo>
# example:
node src/index.js --latest benparvar github-tag-list
```

The module also exports `fetchRepoTags(owner, repo, options)` which returns an array of tags: `{ name, commitSha }`.

## Tests

Run tests with:

```bash
npm test
```

Notes:
- To increase API rate limits, set `GITHUB_TOKEN` environment variable.

## Architecture

- **Service layer**: `src/githubTags.js` contains the core logic to call the GitHub API and returns a small, testable data structure (`{ name, commitSha }`). It is independent from the CLI and supports dependency injection of `fetch` for easier testing.
- **CLI**: `src/index.js` is a thin CLI that calls the service and prints JSON. This keeps responsibilities separated.
- **Tests**: `tests/` contains unit tests (Jest) that mock the HTTP layer.

This structure follows a small, layered approach: controller (CLI) -> service (API client) -> HTTP.

## How to run

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run the CLI (prints JSON array of tags):

```bash
node src/index.js <owner> <repo>
```

Set `GITHUB_TOKEN` in the environment to increase API limits (optional):

```bash
export GITHUB_TOKEN=ghp_... # on Windows PowerShell: $env:GITHUB_TOKEN = 'ghp_...'
```
