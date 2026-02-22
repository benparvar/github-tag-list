import { fetchRepoTags, fetchRepoLatest } from './githubTags.js';

const args = process.argv.slice(2);
let latest = false;
if (args[0] === '--latest' || args[0] === '-l') {
  latest = true;
  args.shift();
}

const [owner, repo] = args;
if (!owner || !repo) {
  console.error('Usage: node src/index.js [--latest] <owner> <repo>');
  process.exit(1);
}

if (latest) {
  fetchRepoLatest(owner, repo)
    .then(rel => {
      console.log(JSON.stringify(rel, null, 2));
    })
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
} else {
  fetchRepoTags(owner, repo)
    .then(tags => {
      console.log(JSON.stringify(tags, null, 2));
    })
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}
