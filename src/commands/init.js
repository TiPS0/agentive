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
  readSettings,
  updateArchitectureRules,
} = require('../utils/fileSystem');

async function runInit(options = {}) {
  const cwd = process.cwd();
  const projectName = path.basename(cwd);

  console.log('');
  console.log(chalk.bold.cyan(`  Agentive v${version}`) + chalk.gray(' — Universal AI Agent Workspace Setup'));
  console.log(chalk.gray('  ─────────────────────────────────────────────'));
  console.log('');

  // --- Guard: check if .agents/ already exists ---
  const alreadyExists = await agentDirectoryExists(cwd);
  let existingSettings = null;

  if (alreadyExists) {
    console.log(chalk.yellow('  ⚠ ') + chalk.white('.agents/ already exists in this project.'));
    const updateResponse = await prompts({
      type: 'confirm',
      name: 'update',
      message: 'Do you want to update to the latest version?',
      initial: true,
    });

    if (!updateResponse.update) {
      console.log(chalk.yellow('  ⚠ ') + 'Update cancelled.');
      console.log('');
      process.exit(0);
    }
    existingSettings = await readSettings(path.join(cwd, '.agents')) || {};
  }

  console.log(chalk.gray('  Installing to: ') + chalk.white(cwd));
  console.log('');

  // --- Prepare Static Options ---
  const allProjectTypes = [
    { title: 'General / Universal', value: 'general' },
    { title: 'Web Development', value: 'web' },
    { title: 'Mobile Development', value: 'mobile' },
    { title: 'Desktop Development', value: 'desktop' }
  ];

  const allFrameworksMap = {
    web: [
      { title: 'Next.js', value: 'nextjs' },
      { title: 'Nuxt', value: 'nuxt' }
    ],
    mobile: [
      { title: 'Expo (Recommended)', value: 'expo' },
      { title: 'React Native', value: 'react-native' }
    ],
    desktop: [
      { title: 'Electron', value: 'electron' },
      { title: 'Tauri', value: 'tauri' }
    ]
  };

  const availableTypes = new Set(['general']);
  const availableFrameworks = { web: new Set(), mobile: new Set(), desktop: new Set() };

  const localTemplatesDir = path.join(__dirname, '..', 'templates');
  let isLocalMode = false;

  try {
    const fs = require('fs/promises');
    const localStat = await fs.stat(localTemplatesDir).catch(() => null);
    
    if (localStat && localStat.isDirectory() && !process.env.AGENTIVE_API_URL && !options.remote) {
      isLocalMode = true;
      const entries = await fs.readdir(localTemplatesDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'base') {
          availableTypes.add(entry.name);
          
          if (!availableFrameworks[entry.name]) availableFrameworks[entry.name] = new Set();
          const fwEntries = await fs.readdir(path.join(localTemplatesDir, entry.name), { withFileTypes: true }).catch(() => []);
          for (const fwEntry of fwEntries) {
            if (fwEntry.isDirectory()) {
              availableFrameworks[entry.name].add(fwEntry.name);
            }
          }
        }
      }
    }
  } catch (e) {}

  if (!isLocalMode) {
    // Remote mode
    const NAS_BASE_URL = process.env.AGENTIVE_API_URL || 'https://agentive-api.tipso.dev';
    try {
      console.log(chalk.gray(`  [DEBUG] Fetching config from ${NAS_BASE_URL}/v1/config ...`));
      const configRes = await fetch(`${NAS_BASE_URL}/v1/config`);
      if (configRes.ok) {
        const configData = await configRes.json();
        // console.log(chalk.yellow('  [DEBUG] Raw API Config Data:'));
        // console.log(chalk.gray(JSON.stringify(configData, null, 2)));
        
        if (configData.projectTypes && Array.isArray(configData.projectTypes)) {
          for (const pt of configData.projectTypes) {
            availableTypes.add(pt.value);
            if (pt.frameworks && Array.isArray(pt.frameworks)) {
              if (!availableFrameworks[pt.value]) availableFrameworks[pt.value] = new Set();
              for (const fw of pt.frameworks) {
                availableFrameworks[pt.value].add(fw.value);
              }
            }
          }
        } else {
          throw new Error(`API responded with invalid format`);
        }
      } else {
        throw new Error(`API responded with status ${configRes.status}`);
      }
    } catch (e) {
      console.log(chalk.yellow(`  [DEBUG] Fallback activated due to error: ${e.message}`));
      // Fallback
      availableTypes.add('web');
      availableTypes.add('mobile');
      availableTypes.add('desktop');
      availableFrameworks['web'].add('nextjs');
      availableFrameworks['web'].add('nuxt');
      availableFrameworks['mobile'].add('expo');
      availableFrameworks['desktop'].add('electron');
      availableFrameworks['desktop'].add('tauri');
    }
  }

  // --- Apply Disabled State ---
  const finalProjectTypes = allProjectTypes.map(pt => ({
    ...pt,
    disabled: !availableTypes.has(pt.value)
  }));

  const finalFrameworksMap = {};
  for (const type of Object.keys(allFrameworksMap)) {
    finalFrameworksMap[type] = allFrameworksMap[type].map(fw => ({
      ...fw,
      disabled: !availableFrameworks[type] || !availableFrameworks[type].has(fw.value)
    }));
  }

  let defaultProjectTypeIndex = finalProjectTypes.findIndex(pt => pt.value === existingSettings?.projectType && !pt.disabled);
  if (defaultProjectTypeIndex === -1) defaultProjectTypeIndex = 0;

  const typeResponse = await prompts({
    type: 'select',
    name: 'projectType',
    message: 'What type of project are you building?',
    choices: finalProjectTypes,
    initial: defaultProjectTypeIndex,
  });

  if (!typeResponse.projectType) {
    console.log(chalk.red('  ✖ ') + 'Setup cancelled.');
    process.exit(1);
  }

  let framework = null;
  const projectType = typeResponse.projectType;

  if (projectType !== 'general') {
    const frameworkChoices = finalFrameworksMap[projectType] || [];
    
    if (frameworkChoices.length > 0) {
      let defaultFrameworkIndex = frameworkChoices.findIndex(fw => fw.value === existingSettings?.framework && !fw.disabled);
      if (defaultFrameworkIndex === -1) defaultFrameworkIndex = 0;

      const fwResponse = await prompts({
        type: 'select',
        name: 'framework',
        message: 'Which framework are you using?',
        choices: frameworkChoices,
        initial: defaultFrameworkIndex,
      });

      if (!fwResponse.framework) {
        console.log(chalk.red('  ✖ ') + 'Setup cancelled.');
        process.exit(1);
      }
      framework = fwResponse.framework;
    }
  }

  console.log('');

  // --- Scaffold .agents/ directory ---
  const agentsDir = await createAgentDirectory(cwd, false);
  await copyTemplates(agentsDir, projectName, projectType, framework, options.remote);
  await updateArchitectureRules(cwd);

  // --- Write settings.json and settings.local.json ---
  await writeSettings(agentsDir, {
    projectName: existingSettings?.projectName || projectName,
    projectType,
    framework,
    agentiveVersion: version,
    createdAt: existingSettings?.createdAt || new Date().toISOString(),
    dependencies: existingSettings?.dependencies || {}
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
  console.log(chalk.gray('    ├── skills/                     ← agent capabilities'));
  console.log(chalk.gray('    ├── library/                    ← passive documentation'));
  console.log(chalk.gray('    └── rules/                      ← project guidelines'));
  console.log('');
}

module.exports = { runInit };
