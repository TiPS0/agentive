#!/usr/bin/env node

'use strict';

const { Command } = require('commander');
const { version } = require('../package.json');

const program = new Command();

program
  .name('agentive')
  .description('Universal AI agent workspace setup CLI')
  .version(version, '-v, --version', 'Print the current version');

program
  .command('init', { isDefault: true })
  .description('Initialize a universal .agents/ workspace in your project')
  .option('--remote', 'Force using templates from the remote API instead of local files')
  .action(async (options) => {
    const { runInit } = require('../src/commands/init');
    await runInit(options);
  });

program
  .command('install <package>')
  .alias('add')
  .description('Install a skill or rule from the registry')
  .action(async (packageName) => {
    const { runInstall } = require('../src/commands/install');
    await runInstall(packageName);
  });

program
  .command('remove <package>')
  .alias('rm')
  .description('Remove an installed skill or rule')
  .action(async (packageName) => {
    const { runRemove } = require('../src/commands/remove');
    await runRemove(packageName);
  });

program
  .command('sync')
  .description('Sync and update physical .agents/ files from the remote dataset')
  .action(async () => {
    const { runSync } = require('../src/commands/sync');
    await runSync();
  });

program.parse(process.argv);
