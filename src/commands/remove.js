'use strict';

const path = require('path');
const chalk = require('chalk');
const fs = require('fs/promises');
const { agentDirectoryExists, removeDependency, readSettings, unlinkAgentFile } = require('../utils/fileSystem');

async function runRemove(packageName) {
  const cwd = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('  🤖 agentive') + chalk.gray(' — Removing Package'));
  console.log(chalk.gray('  ─────────────────────────────────────────────'));
  console.log('');

  const exists = await agentDirectoryExists(cwd);
  if (!exists) {
    console.log(chalk.red('  ✖ ') + 'No .agents/ directory found.');
    process.exit(1);
  }

  if (!packageName) {
    console.log(chalk.red('  ✖ ') + 'Please specify a package to remove.');
    process.exit(1);
  }

  const agentsDir = path.join(cwd, '.agents');
  const settings = await readSettings(agentsDir);
  
  if (!settings || !settings.dependencies || !settings.dependencies[packageName]) {
    console.log(chalk.yellow('  ⚠ ') + `Package '${packageName}' is not installed in settings.json.`);
  }

  let type = 'skill';
  let name = packageName;
  if (settings && settings.dependencies && settings.dependencies[packageName]) {
    type = settings.dependencies[packageName].type || 'skill';
    name = settings.dependencies[packageName].name || packageName;
  }

  const folderName = type.endsWith('s') ? type : `${type}s`;
  const targetFile = path.join(agentsDir, folderName, `${packageName}.md`);

  try {
    await fs.rm(targetFile, { force: true });
    const removedFromSettings = await removeDependency(agentsDir, packageName);
    await unlinkAgentFile(cwd, `.agents/${folderName}/${packageName}.md`, `[${type.toUpperCase()}] ${name}`);
    
    if (removedFromSettings) {
      console.log(chalk.green('  ✔ ') + `Successfully removed ${chalk.cyan(packageName)}`);
    } else {
      console.log(chalk.green('  ✔ ') + `Deleted file for ${chalk.cyan(packageName)}`);
    }
  } catch (err) {
    console.log(chalk.red('  ✖ ') + `Failed to remove: ${err.message}`);
  }
  console.log('');
}

module.exports = { runRemove };
