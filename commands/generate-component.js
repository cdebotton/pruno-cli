"use strict";

let generateComponent = (program) => program.command('generate:component <name> [...mixins]')
  .description('Generate a React component.')
  .option('-s --stores <...stores>', 'Stores to listen to', [])
  .option('-a --actions <...actions>', 'Actions to include', [])
  .action((name, actions) => {

  });

export default generateComponent;
