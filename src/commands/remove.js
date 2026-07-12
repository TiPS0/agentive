'use strict';

const path = require('path');
const chalk = require('chalk');
const fs = require('fs/promises');
const { agentDirectoryExists, removeDependency, readSettings, unlinkAgentFile, removeSkillFromReadme, removeLibraryFromReadme } = require('../utils/fileSystem');

async function runRemove(packageName) {
  const cwd = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('  Agentive') + chalk.gray(' — Removing Package'));
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

  const folderName = type === 'library' ? 'library' : (type.endsWith('s') ? type : `${type}s`);
  const oldTargetFile = path.join(agentsDir, folderName, `${packageName}.md`);
  const newTargetFolder = path.join(agentsDir, folderName, packageName);

  try {
    await fs.rm(oldTargetFile, { force: true });
    await fs.rm(newTargetFolder, { recursive: true, force: true });
    
    // Also try to remove cursor file if it exists
    const cursorFile = path.join(cwd, '.cursor', 'rules', `${packageName}.mdc`);
    await fs.rm(cursorFile, { force: true }).catch(() => {});
    
    const removedFromSettings = await removeDependency(agentsDir, packageName);
    
    await unlinkAgentFile(cwd, `.agents/${folderName}/${packageName}.md`, `[${type.toUpperCase()}] ${name}`);
    
    if (type === 'skill') {
      await unlinkAgentFile(cwd, `.agents/skills/${packageName}/SKILL.md`, `[${type.toUpperCase()}] ${name}`);
      await removeSkillFromReadme(agentsDir, packageName);
    } else if (type === 'library') {
      await unlinkAgentFile(cwd, `.agents/library/${packageName}/info.md`, `[LIBRARY] ${name}`);
      await removeLibraryFromReadme(agentsDir, packageName);
    }
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
