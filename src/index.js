import { fetchRepoTags, fetchRepoLatest } from './githubTags.js';
import { getExtensionVersion } from './vscodePluginVersion.js';

const extensionId = "github.copilot-chat";
const args = process.argv.slice(2);
let latest = false;
let pluginVersion = false;
if (args[0] === '--latest' || args[0] === '-l') {
  latest = true;
  args.shift();
} else if (args[0] === '--plugin-version' || args[0] === '-p') {
  pluginVersion = true;
  args.shift();
}

const [owner, repo] = args;
if ((!owner || !repo) && !pluginVersion) {
  console.error('Usage: node src/index.js [--latest|--plugin-version] <owner> <repo>');
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
} else if (pluginVersion) {
  console.log(JSON.stringify({ version: pluginVersion }, null, 2));

getExtensionVersion(extensionId)
  .then(version => {
    if (version) {
      console.log(`Versão instalada de ${extensionId}:`, version);
    } else {
      console.log("Extensão não encontrada.");
    }
  })
  .catch(err => {
    console.error("Erro ao obter versão:", err.message);
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
