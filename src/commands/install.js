'use strict';

const path = require('path');
const chalk = require('chalk');
const fs = require('fs/promises');
const { agentDirectoryExists, addDependency, linkAgentFile } = require('../utils/fileSystem');

// A simple regex to parse YAML frontmatter block at the start of a string
const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

function parseFrontmatter(content) {
  const match = content.match(frontmatterRegex);
  const metadata = {};
  if (match && match[1]) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim().replace(/^['"](.*)['"]$/, '$1');
        metadata[key] = value;
      }
    });
  }
  return { metadata, rawMatch: match ? match[0] : '' };
}

async function runInstall(packageName) {
  const cwd = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('  🤖 agentive') + chalk.gray(' — Installing Package'));
  console.log(chalk.gray('  ─────────────────────────────────────────────'));
  console.log('');

  const exists = await agentDirectoryExists(cwd);
  if (!exists) {
    console.log(chalk.red('  ✖ ') + 'No .agents/ directory found. Run `npx agentive init` first.');
    process.exit(1);
  }

  if (!packageName) {
    console.log(chalk.red('  ✖ ') + 'Please specify a package to install.');
    process.exit(1);
  }

  console.log(chalk.gray(`  Fetching ${packageName}...`));

  let fileContent = '';
  try {
    let url = packageName;
    if (!url.startsWith('http')) {
      // Mock registry URL for demonstration
      url = `https://raw.githubusercontent.com/TiPS0/agentive-registry/main/packages/${packageName}.md`;
    }
    
    // Attempt fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from registry (Status: ${response.status})`);
    }
    fileContent = await response.text();
  } catch (err) {
    console.log(chalk.yellow('  ⚠ ') + `Fetch failed: ${err.message}`);
    console.log(chalk.gray('  Creating a mock package for demonstration...'));
    fileContent = `---
name: ${packageName}
type: skill
version: 1.0.0
description: A mock skill for ${packageName}
---
# ${packageName}
This is a generated placeholder skill because the registry could not be reached.
`;
  }

  const { metadata } = parseFrontmatter(fileContent);
  const type = metadata.type || 'skill';
  const name = metadata.name || packageName;
  const version = metadata.version || '1.0.0';
  
  // Pluralize type for folder name (skill -> skills, rule -> rules)
  const folderName = type.endsWith('s') ? type : `${type}s`;
  const agentsDir = path.join(cwd, '.agents');
  const targetFolder = path.join(agentsDir, folderName);
  const targetFile = path.join(targetFolder, `${packageName}.md`);
  
  try {
    await fs.mkdir(targetFolder, { recursive: true });
    await fs.writeFile(targetFile, fileContent, 'utf-8');
    
    await addDependency(agentsDir, packageName, version, type);
    await linkAgentFile(cwd, `.agents/${folderName}/${packageName}.md`, `[${type.toUpperCase()}] ${name}`);
    
    console.log(chalk.green('  ✔ ') + `Successfully installed ${chalk.cyan(name)} v${version}`);
    console.log(chalk.gray(`      Location: .agents/${folderName}/${packageName}.md`));
  } catch (err) {
    console.log(chalk.red('  ✖ ') + `Failed to write file: ${err.message}`);
    process.exit(1);
  }
  console.log('');
}

module.exports = { runInstall };
