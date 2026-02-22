import { exec } from "child_process";

export function getExtensionVersion(extensionId) {
  return new Promise((resolve, reject) => {
    exec("code --list-extensions --show-versions", (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const lines = stdout.split("\n");
      const match = lines.find(line => line.startsWith(extensionId + "@"));

      if (!match) {
        return resolve(null);
      }

      const version = match.split("@")[1];
      resolve(version);
    });
  });
}