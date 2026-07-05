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
  .description('Initialize a universal .agent/ workspace in your project')
  .action(async () => {
    const { runInit } = require('../src/commands/init');
    await runInit();
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

program.parse(process.argv);
