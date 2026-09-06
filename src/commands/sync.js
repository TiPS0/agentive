'use strict';

const path = require('path');
const chalk = require('chalk');
const {
  agentDirectoryExists,
  readSettings,
  copyTemplates,
  updateArchitectureRules
} = require('../utils/fileSystem');

async function runSync() {
  const cwd = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('  Agentive') + chalk.gray(' — Syncing dataset updates'));
  console.log(chalk.gray('  ─────────────────────────────────────────────'));
  console.log('');

  const exists = await agentDirectoryExists(cwd);
  if (!exists) {
    console.log(chalk.red('  ✖ ') + 'No .agents/ directory found. Run `npx agentive init` first.');
    process.exit(1);
  }

  const agentsDir = path.join(cwd, '.agents');
  const settings = await readSettings(agentsDir);

  if (!settings) {
    console.log(chalk.red('  ✖ ') + 'Could not read .agents/settings.json.');
    process.exit(1);
  }

  const projectType = settings.projectType || 'general';
  const framework = settings.framework || null;
  const projectName = settings.projectName || path.basename(cwd);

  console.log(chalk.gray(`  Syncing category: `) + chalk.white(`${projectType}${framework ? '/' + framework : ''}`));

  try {
    // Re-run copyTemplates to download physical files and overwrite the local .agents
    await copyTemplates(agentsDir, projectName, projectType, framework);
    await updateArchitectureRules(cwd);
    console.log('');
    console.log(chalk.green('  ✔ ') + 'Successfully synced physical dataset from the Agentive Server.');
    console.log(chalk.gray('  (Note: local modifications to skills/rules might have been overwritten)'));
  } catch (err) {
    console.log(chalk.red('  ✖ ') + 'Sync failed: ' + err.message);
    process.exit(1);
  }
  
  console.log('');
}

module.exports = { runSync };
