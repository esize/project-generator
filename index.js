#! /usr/bin/env node

const program = require('commander');
const fs = require('fs')

const command_new = require('./commands/new');
const command_init = require('./commands/init');

program
  .command('new')
  .alias('n')
  .description("Create a new project and generate it's boilerplate")
  .action(function() {
    command_new();
  });

program
  .command('init')
  .description('Configure the project cli')
  .action(function() {
    command_init();
  })

program.parse(process.argv);
