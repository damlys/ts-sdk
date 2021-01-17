#!/usr/bin/env node

// {
//   "scripts": {
//     "version": "add-keepachangelog-header ./CHANGELOG.md && git add ./CHANGELOG.md"
//   }
// }

const fs = require("fs").promises;
const path = require("path");

async function main() {
  try {
    const changelogPath = path.join(process.cwd(), process.argv[2] || "CHANGELOG.md");
    const packageJsonPath = path.join(process.cwd(), "package.json");

    const { version } = require(packageJsonPath);
    if (typeof version !== "string" || version === "") {
      throw new Error("Package version is not defined.");
    }

    const changelogContent = (await fs.readFile(changelogPath)).toString();

    const searchText = "\n## Unreleased\n";
    const replaceText = `\n## Unreleased\n\n## [${version}] - ${new Date().toISOString().split("T")[0]}\n`;
    const newChangelogContent = changelogContent.replace(searchText, replaceText);
    if (newChangelogContent === changelogContent) {
      throw new Error(`Cannot find "## Unreleased" header in the "${changelogPath}" file.`);
    }

    await fs.writeFile(changelogPath, newChangelogContent);

    process.stdout.write(`Changelog ${version} header has been added.\n`);
    process.exit(0);
  } catch (error) {
    process.stderr.write(`Something went wrong!\n${error.toString()}\n`);
    process.exit(1);
  }
}

main();
