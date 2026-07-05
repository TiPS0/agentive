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

program.parse(process.argv);
