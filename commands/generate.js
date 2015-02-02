"use strict";

import {join} from "path";
import {pwd} from "shelljs";

let generate = (program) => {
  const {PROJECT_TYPE} = require(join(pwd(), '.prunorc'));

  return program.command('generate <action>')
    .alias('g')
    .description(`Generate a new ${PROJECT_TYPE || ''} component.`)
    .action((action, options) => {

    });
};

export default generate;
