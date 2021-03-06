"use strict";

import addMixes from "../utils/add-mixes";

let install = (program) => program.command('install <mixes...>')
  .alias('i')
  .description('Install and configure a new pruno-mix.')
  .action(addMixes);

export default install;
