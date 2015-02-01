"use strict";

import addMixes from "../utils/add-mixes";

let add = (program) => program.command('add <mixes...>')
  .description('Install and configure a new pruno-mix.')
  .action(addMixes);

export default add;
