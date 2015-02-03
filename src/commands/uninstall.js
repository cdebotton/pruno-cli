"use strict";

var uninstall = (program) => program.command('uninstall <mixes...>')
  .alias('rm')
  .description('Remove pruno mixes.')
  .action((mixes, options) => {

  });

export default uninstall;
