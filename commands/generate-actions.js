"use strict";

let generateActions = (program) => program.command('generate:actions <name> [...actions]')
  .description('Generate a set of flux actions.')
  .action((name, actions) => {

  });

export default generateActions;
