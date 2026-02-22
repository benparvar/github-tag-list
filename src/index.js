import { fetchRepoTags } from './githubTags.js';

const [,, owner, repo] = process.argv;
if (!owner || !repo) {
  console.error('Usage: node src/index.js <owner> <repo>');
  process.exit(1);
}

fetchRepoTags(owner, repo)
  .then(tags => {
    console.log(JSON.stringify(tags, null, 2));
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
