'use strict';

const fs = require('fs/promises');
const path = require('path');

// ─── Guards ──────────────────────────────────────────────────────────────────

/**
 * Check if a .agents/ directory already exists in the given working directory.
 * @param {string} cwd
 * @returns {Promise<boolean>}
 */
async function agentDirectoryExists(cwd) {
  try {
    await fs.access(path.join(cwd, '.agents'));
    return true;
  } catch {
    return false;
  }
}

// ─── Directory Creation ───────────────────────────────────────────────────────

/**
 * Create (or recreate) the .agents/ directory structure inside the user's project.
 *
 * Structure:
 *   AGENTS.md               ← project root
 *   .agents/
 *   ├── settings.json
 *   ├── settings.local.json
 *   ├── skills/
 *   ├── library/
 *   └── rules/
 *
 * @param {string} cwd - The user's current working directory
 * @param {boolean} overwrite - Whether to remove an existing .agents/ directory first
 * @returns {Promise<string>} The path to the created .agents/ directory
 */
async function createAgentDirectory(cwd, overwrite = false) {
  const agentsDir = path.join(cwd, '.agents');

  if (overwrite) {
    await fs.rm(agentsDir, { recursive: true, force: true });
  }

  await fs.mkdir(agentsDir, { recursive: true });

  return agentsDir;
}

// ─── Settings Files ───────────────────────────────────────────────────────────

/**
 * Write settings.json and settings.local.json inside .agents/.
 *
 * - settings.json        → tracked by git (project-wide config)
 * - settings.local.json  → gitignored (machine-specific overrides)
 *
 * Also appends `.agents/settings.local.json` to the project's .gitignore if one exists.
 * Settings no longer include techStack or tools since the wizard was removed.
 *
 * @param {string} agentsDir - Absolute path to .agents/
 * @param {object} settings  - The wizard answers to persist
 */
async function writeSettings(agentsDir, settings) {
  // settings.json — committed to git
  const settingsJson = {
    projectName:      settings.projectName,
    projectType:      settings.projectType || 'general',
    framework:        settings.framework || null,
    agentiveVersion:  settings.agentiveVersion,
    createdAt:        settings.createdAt,
    dependencies:     settings.dependencies || {},
  };
  await fs.writeFile(
    path.join(agentsDir, 'settings.json'),
    JSON.stringify(settingsJson, null, 2) + '\n',
    'utf-8'
  );

  // settings.local.json — NOT committed (machine-specific overrides)
  const localSettingsPath = path.join(agentsDir, 'settings.local.json');
  try {
    await fs.access(localSettingsPath);
  } catch {
    const localSettingsJson = {
      _note: 'This file is gitignored. Add local machine-specific overrides here.',
      overrides: {},
    };
    await fs.writeFile(
      localSettingsPath,
      JSON.stringify(localSettingsJson, null, 2) + '\n',
      'utf-8'
    );
  }

  // Auto-append to .gitignore if it exists in cwd
  const cwd = path.dirname(agentsDir);
  const gitignorePath = path.join(cwd, '.gitignore');
  try {
    let gitignore = await fs.readFile(gitignorePath, 'utf-8');
    const entry = '.agents/settings.local.json';
    if (!gitignore.includes(entry)) {
      gitignore += `\n# Agentive local settings (machine-specific)\n${entry}\n`;
      await fs.writeFile(gitignorePath, gitignore, 'utf-8');
    }
  } catch {
    // No .gitignore present — silently skip
  }
}

// ─── Template Copying ─────────────────────────────────────────────────────────

/**
 * Copy template files from src/templates/ into the user's project.
 *
 * - AGENTS.md → project root (cwd)
 * - skills/, rules/, library/ → .agents/
 *
 * Replaces {{PROJECT_NAME}} and {{YEAR}} placeholders.
 *
 * @param {string} agentsDir    - Absolute path to .agents/
 * @param {string} projectName  - The user's project name
 * @param {string} projectType  - e.g., 'general', 'web', 'mobile'
 * @param {string} framework    - e.g., 'expo', 'react-native'
 */
async function copyTemplates(agentsDir, projectName, projectType = 'general', framework = null) {
  const cwd = path.dirname(agentsDir);
  const NAS_BASE_URL = process.env.AGENTIVE_API_URL || 'https://agentive.tipso.dev';

  let category = 'base';
  if (projectType !== 'general' && framework) {
    category = `${projectType}/${framework}`;
  }

  const exportUrl = `${NAS_BASE_URL}/v1/export?category=${category}`;

  try {
    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${exportUrl}: ${response.statusText}`);
    }
    
    const files = await response.json();

    for (const [relativePath, rawContent] of Object.entries(files)) {
      let content = rawContent;
      let targetPath;

      if (relativePath === 'AGENTS.md') {
        targetPath = path.join(cwd, 'AGENTS.md');
        content = replacePlaceholders(content, projectName);

        // Append/Prepend logic for AGENTS.md
        try {
          const existingContent = await fs.readFile(targetPath, 'utf-8');
          if (existingContent.trim()) {
            const syncText = 'Re-run `npx @p_tipso/agentive` any time to re-sync changes to your AI tools.';
            const syncIndex = existingContent.indexOf(syncText);
            
            if (syncIndex !== -1) {
              const customPart = existingContent.substring(syncIndex + syncText.length).trimStart();
              content = content + (customPart ? '\n\n' + customPart : '');
            } else if (existingContent.includes('# Agent Instructions')) {
              content = existingContent;
            } else {
              content = content + '\n\n' + existingContent;
            }
          }
        } catch { /* target may not exist */ }
      } else if (relativePath === '.aiignore' || relativePath === 'aiignore') {
        targetPath = path.join(cwd, '.aiignore');
      } else {
        // This covers skills/, rules/, library/, etc.
        // Remove leading slash if any to avoid path joining issues
        const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        
        // Remove base/ or category/ prefix if the backend accidentally included it in the keys.
        // Wait, the backend log says keys are "AGENTS.md", "skills/agent-grill/SKILL.md". So they are already relative.
        targetPath = path.join(agentsDir, cleanRelativePath);
      }

      // Ensure directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // Write file
      await fs.writeFile(targetPath, content, 'utf-8');
    }
  } catch (err) {
    console.error('Warning: Failed to fetch templates from remote API:', err.message);
  }
}

/**
 * Replace template placeholders with actual values.
 * @param {string} content
 * @param {string} projectName
 * @returns {string}
 */
function replacePlaceholders(content, projectName) {
  return content
    .replace(/\{\{PROJECT_NAME\}\}/g, projectName || '')
    .replace(/\{\{YEAR\}\}/g, new Date().getFullYear().toString());
}

/**
 * Internal: recursively copies files from src to dest, replacing placeholders.
 * @param {string} src
 * @param {string} dest
 * @param {string} projectName
 */
async function copyDirectoryRecursive(src, dest, projectName) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDirectoryRecursive(srcPath, destPath, projectName);
    } else {
      let content = await fs.readFile(srcPath, 'utf-8');
      content = replacePlaceholders(content, projectName);
      await fs.writeFile(destPath, content, 'utf-8');
    }
  }
}
// ─── Package Manager Utilities ────────────────────────────────────────────────

/**
 * Read the settings.json file.
 */
async function readSettings(agentsDir) {
  try {
    const content = await fs.readFile(path.join(agentsDir, 'settings.json'), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Update the settings.json file.
 */
async function updateSettings(agentsDir, newSettings) {
  await fs.writeFile(
    path.join(agentsDir, 'settings.json'),
    JSON.stringify(newSettings, null, 2) + '\n',
    'utf-8'
  );
}

/**
 * Add a dependency to settings.json
 */
async function addDependency(agentsDir, packageName, version, type = 'skill') {
  const settings = await readSettings(agentsDir);
  if (!settings) return false;
  if (!settings.dependencies) settings.dependencies = {};
  settings.dependencies[packageName] = { version, type };
  await updateSettings(agentsDir, settings);
  return true;
}

/**
 * Remove a dependency from settings.json
 */
async function removeDependency(agentsDir, packageName) {
  const settings = await readSettings(agentsDir);
  if (!settings) return false;
  if (settings.dependencies && settings.dependencies[packageName]) {
    delete settings.dependencies[packageName];
    await updateSettings(agentsDir, settings);
    return true;
  }
  return false;
}

/**
 * Link a downloaded agent file into AGENTS.md
 */
async function linkAgentFile(cwd, relativePath, title, heading = '## Installed Skills') {
  const agentMdPath = path.join(cwd, 'AGENTS.md');
  const linkStr = `- [${title}](${relativePath})`;
  
  try {
    let content = await fs.readFile(agentMdPath, 'utf-8');
    
    if (!content.includes(linkStr)) {
      if (content.includes(heading)) {
        content = content.replace(heading, `${heading}\n${linkStr}`);
      } else {
        content = content.trimEnd() + `\n\n${heading}\n${linkStr}\n`;
      }
      await fs.writeFile(agentMdPath, content, 'utf-8');
    }
  } catch (err) {
    // AGENTS.md might not exist
  }
}

/**
 * Unlink a removed agent file from AGENTS.md
 */
async function unlinkAgentFile(cwd, relativePath, title) {
  const agentMdPath = path.join(cwd, 'AGENTS.md');
  try {
    let content = await fs.readFile(agentMdPath, 'utf-8');
    const linkStr = `- [${title}](${relativePath})`;
    if (content.includes(linkStr)) {
      content = content.replace(new RegExp(`\\n?${escapeRegex(linkStr)}\\n?`, 'g'), '\n');
      await fs.writeFile(agentMdPath, content, 'utf-8');
    }
  } catch (err) {
    // AGENTS.md might not exist
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update the .agents/skills/README.md
 */
async function updateSkillsReadme(agentsDir, packageName, description, version) {
  const readmePath = path.join(agentsDir, 'skills', 'README.md');
  const heading = '## Installed Skills';
  const linkStr = `- **[${packageName}](./${packageName}/SKILL.md)** (v${version}): ${description || 'No description available.'}`;
  
  try {
    let content = await fs.readFile(readmePath, 'utf-8');
    
    if (!content.includes(linkStr)) {
      if (content.includes(heading)) {
        content = content.replace(heading, `${heading}\n${linkStr}`);
      } else {
        content = content.trimEnd() + `\n\n${heading}\n${linkStr}\n`;
      }
      await fs.writeFile(readmePath, content, 'utf-8');
    }
  } catch (err) {
    // README doesn't exist, create it
    const content = `# Skills Directory\n\nThis directory contains AI agent skills.\n\n${heading}\n${linkStr}\n`;
    await fs.writeFile(readmePath, content, 'utf-8');
  }
}

/**
 * Remove a skill from .agents/skills/README.md
 */
async function removeSkillFromReadme(agentsDir, packageName) {
  const readmePath = path.join(agentsDir, 'skills', 'README.md');
  try {
    let content = await fs.readFile(readmePath, 'utf-8');
    const lines = content.split('\n');
    const newLines = lines.filter(line => !line.includes(`[${packageName}](./${packageName}/SKILL.md)`));
    await fs.writeFile(readmePath, newLines.join('\n'), 'utf-8');
  } catch (err) {
    // If it doesn't exist, do nothing
  }
}

/**
 * Update the .agents/library/README.md
 */
async function updateLibraryReadme(agentsDir, packageName, description, version) {
  const readmePath = path.join(agentsDir, 'library', 'README.md');
  const heading = '## Installed Libraries';
  const linkStr = `- **[${packageName}](./${packageName}/info.md)** (v${version}): ${description || 'No description available.'}`;
  
  try {
    let content = await fs.readFile(readmePath, 'utf-8');
    
    if (!content.includes(linkStr)) {
      if (content.includes(heading)) {
        content = content.replace(heading, `${heading}\n${linkStr}`);
      } else {
        content = content.trimEnd() + `\n\n${heading}\n${linkStr}\n`;
      }
      await fs.writeFile(readmePath, content, 'utf-8');
    }
  } catch (err) {
    await fs.mkdir(path.dirname(readmePath), { recursive: true });
    const content = `# Library Directory\n\nThis directory contains AI agent passive library references.\n\n${heading}\n${linkStr}\n`;
    await fs.writeFile(readmePath, content, 'utf-8');
  }
}

/**
 * Remove a library from .agents/library/README.md
 */
async function removeLibraryFromReadme(agentsDir, packageName) {
  const readmePath = path.join(agentsDir, 'library', 'README.md');
  try {
    let content = await fs.readFile(readmePath, 'utf-8');
    const lines = content.split('\n');
    const newLines = lines.filter(line => !line.includes(`[${packageName}](./${packageName}/info.md)`));
    await fs.writeFile(readmePath, newLines.join('\n'), 'utf-8');
  } catch (err) {
    // If it doesn't exist, do nothing
  }
}

module.exports = {
  agentDirectoryExists,
  createAgentDirectory,
  writeSettings,
  copyTemplates,
  readSettings,
  updateSettings,
  addDependency,
  removeDependency,
  linkAgentFile,
  unlinkAgentFile,
  updateSkillsReadme,
  removeSkillFromReadme,
  updateLibraryReadme,
  removeLibraryFromReadme,
};
