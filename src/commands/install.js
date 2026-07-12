'use strict';

const path = require('path');
const chalk = require('chalk');
const fs = require('fs/promises');
const prompts = require('prompts');
const { agentDirectoryExists, addDependency, linkAgentFile, updateLibraryReadme } = require('../utils/fileSystem');

async function checkExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function runInstall(packageName) {
  const cwd = process.cwd();

  console.log('');
  console.log(chalk.bold.cyan('  Agentive') + chalk.gray(' — Installing Library Package'));
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

  let infoContent = '';
  let typesContent = '';
  let rulesContent = '';
  let combinedContent = '';
  let name = packageName;
  let version = '1.0.0';
  let description = `A library package for ${packageName}`;

  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from NPM registry (Status: ${response.status})`);
    }
    const npmData = await response.json();
    
    version = npmData['dist-tags']?.latest || '1.0.0';
    description = npmData.description || description;
    name = npmData.name || packageName;
    const homepage = npmData.homepage || npmData.repository?.url || `https://www.npmjs.com/package/${packageName}`;
    let readmeContent = npmData.readme || '';
    
    if (!readmeContent) {
      try {
        const unpkgResponse = await fetch(`https://unpkg.com/${packageName}/README.md`);
        if (unpkgResponse.ok) {
          readmeContent = await unpkgResponse.text();
        }
      } catch (err) {}
    }

    try {
      const typesResponse = await fetch(`https://unpkg.com/${packageName}/index.d.ts`);
      if (typesResponse.ok) {
        typesContent = await typesResponse.text();
      }
    } catch (err) {}

    infoContent = `# ${name} Reference\n\n## Installation Summary\n\`\`\`bash\nnpm install ${name}\n\`\`\`\n\n## Overview\n${description}\n\nFor more information, visit [${name}](${homepage}).\n\n${readmeContent ? `## Documentation\n\n${readmeContent}` : ''}`;
    
    const rulesObj = {
      library: name,
      constraints: [
        `Follow standard practices for ${name}.`,
        `Check official documentation for latest patterns.`
      ]
    };
    rulesContent = JSON.stringify(rulesObj, null, 2);

    combinedContent = `${infoContent}\n\n## Types\n\`\`\`typescript\n${typesContent || '// No types found'}\n\`\`\`\n\n## Rules\n\`\`\`json\n${rulesContent}\n\`\`\``;

  } catch (err) {
    console.log(chalk.red('  ✖ ') + `Fetch failed: ${err.message}`);
    console.log(chalk.gray('  Skipping installation. Please check the package name and try again.'));
    process.exit(1);
  }

  const agentsDir = path.join(cwd, '.agents');
  const targetFolder = path.join(agentsDir, 'library', packageName);
  const relativePath = `.agents/library/${packageName}/info.md`;
  
  const choices = [
    { title: '.agents/library (Agentive Knowledge)', value: 'agents', selected: true }
  ];

  if (await checkExists(path.join(cwd, '.cursor'))) {
    choices.push({ title: '.cursor/rules (Cursor Editor)', value: 'cursor' });
  }
  if (await checkExists(path.join(cwd, '.windsurfrules'))) {
    choices.push({ title: '.windsurfrules (Windsurf Editor)', value: 'windsurf' });
  }
  if (await checkExists(path.join(cwd, '.claude.md'))) {
    choices.push({ title: '.claude.md (Claude AI)', value: 'claude' });
  }

  let selectedDestinations = ['agents'];
  if (choices.length > 1) {
    const { dests } = await prompts({
      type: 'multiselect',
      name: 'dests',
      message: 'Where would you like to install this library?',
      instructions: '\n↑/↓: Move ◦ ←/→ or [Space]: Toggle ◦ A: Toggle all ◦ ↵ Submit',
      choices,
      min: 1
    });
    if (dests && dests.length > 0) {
      selectedDestinations = dests;
    }
  }

  try {
    if (selectedDestinations.includes('agents')) {
      await fs.mkdir(targetFolder, { recursive: true });
      await fs.writeFile(path.join(targetFolder, 'info.md'), infoContent, 'utf-8');
      await fs.writeFile(path.join(targetFolder, 'types.d.ts'), typesContent, 'utf-8');
      await fs.writeFile(path.join(targetFolder, 'rules.json'), rulesContent, 'utf-8');
      
      await addDependency(agentsDir, packageName, version, 'library');
      await linkAgentFile(cwd, relativePath, `[LIBRARY] ${name}`, '## Installed Libraries');
      await updateLibraryReadme(agentsDir, packageName, description, version);
      
      console.log(chalk.green('  ✔ ') + `Successfully installed ${chalk.cyan(name)} v${version} to .agents/library/${packageName}/`);
    }

    if (selectedDestinations.includes('cursor')) {
      const cursorRulesDir = path.join(cwd, '.cursor', 'rules');
      await fs.mkdir(cursorRulesDir, { recursive: true });
      const cursorFile = path.join(cursorRulesDir, `${packageName}.mdc`);
      await fs.writeFile(cursorFile, combinedContent, 'utf-8');
      console.log(chalk.green('  ✔ ') + `Successfully installed ${chalk.cyan(name)} to .cursor/rules/${packageName}.mdc`);
    }

    if (selectedDestinations.includes('windsurf')) {
      const windsurfFile = path.join(cwd, '.windsurfrules');
      let existing = '';
      try { existing = await fs.readFile(windsurfFile, 'utf-8'); } catch(e) {}
      const newContent = existing + `\n\n# Library: ${name}\n\n` + combinedContent;
      await fs.writeFile(windsurfFile, newContent, 'utf-8');
      console.log(chalk.green('  ✔ ') + `Successfully appended ${chalk.cyan(name)} to .windsurfrules`);
    }

    if (selectedDestinations.includes('claude')) {
      const claudeFile = path.join(cwd, '.claude.md');
      let existing = '';
      try { existing = await fs.readFile(claudeFile, 'utf-8'); } catch(e) {}
      const newContent = existing + `\n\n# Library: ${name}\n\n` + combinedContent;
      await fs.writeFile(claudeFile, newContent, 'utf-8');
      console.log(chalk.green('  ✔ ') + `Successfully appended ${chalk.cyan(name)} to .claude.md`);
    }
  } catch (err) {
    console.log(chalk.red('  ✖ ') + `Failed to write file: ${err.message}`);
    process.exit(1);
  }
  console.log('');
}

module.exports = { runInstall };
