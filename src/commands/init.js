'use strict';

const path = require('path');
const chalk = require('chalk');
const prompts = require('prompts');
const { version } = require('../../package.json');
const {
  createAgentDirectory,
  copyTemplates,
  agentDirectoryExists,
  writeSettings,
} = require('../utils/fileSystem');

async function runInit() {
  const cwd = process.cwd();
  const projectName = path.basename(cwd);

  console.log('');
  console.log(chalk.bold.cyan('  🤖 agentive') + chalk.gray(' — Universal AI Agent Workspace Setup'));
  console.log(chalk.gray('  ─────────────────────────────────────────────'));
  console.log('');

  // --- Guard: check if .agents/ already exists ---
  const alreadyExists = await agentDirectoryExists(cwd);
  if (alreadyExists) {
    console.log(chalk.yellow('  ⚠ ') + chalk.white('.agents/ already exists — skipping (no files were modified).'));
    console.log(chalk.gray('  Delete .agents/ first if you want to re-scaffold.'));
    console.log('');
    process.exit(0);
  }

  console.log(chalk.gray('  Installing to: ') + chalk.white(cwd));
  console.log('');

  // --- Prompt User for Project Type ---
  const typeResponse = await prompts({
    type: 'select',
    name: 'projectType',
    message: 'What type of project are you building?',
    choices: [
      { title: 'General / Universal', value: 'general' },
      { title: 'Web Development', value: 'web', disabled: true },
      { title: 'Mobile Development', value: 'mobile' },
    ],
    initial: 0,
  });

  if (!typeResponse.projectType) {
    console.log(chalk.red('  ✖ ') + 'Setup cancelled.');
    process.exit(1);
  }

  let framework = null;
  if (typeResponse.projectType === 'mobile') {
    const fwResponse = await prompts({
      type: 'select',
      name: 'framework',
      message: 'Which framework are you using?',
      choices: [
        { title: 'Expo (Recommended)', value: 'expo' },
        { title: 'React Native', value: 'react-native' },
      ],
      initial: 0,
    });
    
    if (!fwResponse.framework) {
      console.log(chalk.red('  ✖ ') + 'Setup cancelled.');
      process.exit(1);
    }
    framework = fwResponse.framework;
  }

  const projectType = typeResponse.projectType;
  console.log('');

  // --- Scaffold .agents/ directory ---
  const templatesDir = path.join(__dirname, '..', 'templates');
  const agentsDir = await createAgentDirectory(cwd, false);
  await copyTemplates(templatesDir, agentsDir, projectName, projectType, framework);

  // --- Write settings.json and settings.local.json ---
  await writeSettings(agentsDir, {
    projectName,
    projectType,
    framework,
    agentiveVersion: version,
    createdAt: new Date().toISOString(),
  });

  console.log(chalk.green('  ✔ ') + chalk.white('Created ') + chalk.cyan('AGENTS.md'));
  console.log(chalk.green('  ✔ ') + chalk.white('Created ') + chalk.cyan('.aiignore'));
  console.log(chalk.green('  ✔ ') + chalk.white('Scaffolded ') + chalk.cyan('.agents/') + chalk.white(' workspace'));

  // --- Done ---
  console.log('');
  console.log(chalk.bold.green('  ✅ All done!'));
  console.log('');
  console.log(chalk.white('  Your AI workspace is ready:'));
  console.log('');
  console.log(chalk.gray('    AGENTS.md                       ← root agent instructions'));
  console.log(chalk.gray('    .aiignore                       ← hides files from AI to save tokens'));
  console.log(chalk.gray('    .agents/'));
  console.log(chalk.gray('    ├── settings.json               ← project config'));
  console.log(chalk.gray('    ├── settings.local.json         ← local overrides (gitignored)'));
  console.log(chalk.gray('    ├── commands/'));
  console.log(chalk.gray('    │   ├── review.md               ← code review command'));
  console.log(chalk.gray('    │   └── fix-issue.md            ← zero-error fix command'));
  console.log(chalk.gray('    ├── skills/'));
  console.log(chalk.gray('    └── rules/'));
  console.log('');
  console.log(chalk.gray('  Edit the markdown files to customise agent behaviour.'));
  console.log('');
}

module.exports = { runInit };
