"use strict";

import Generator from "../generator";

let generateActions = (program) => program.command('generate:actions <name> [actions...]')
  .description('Generate a set of flux actions.')
  .action((name, actions) => {
    Generator.actions({name, actions});
  });

export default generateActions;
