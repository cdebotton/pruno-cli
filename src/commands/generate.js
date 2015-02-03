"use strict";

import inflection from "inflection";
import {compile} from "handlebars";
import {readdirSync, readFileSync} from "fs";
import {join} from "path";
import {pwd, echo, exit} from "shelljs";
import {log} from "../logger";
import colors from "colors";

import ReactGenerator from "../frameworks/react";
import BackboneGenerator from "../frameworks/backbone";

let generate = (program) => {
  return program.command('generate <action> <name>')
    .alias('g')
    .description(`Generate a new component.`)
    .action((action, name, options) => {
      let [framework, classType] = action.split(':');
      let genDir = join(__dirname, '..', 'frameworks', framework, 'generators');
      try {
        var generators = readdirSync(genDir)
          .map(gen => gen.split('.').shift().toLowerCase());
      }
      catch (err) {
        echo(`Framework '${framework}' isn't available.`);
        exit(1);
      }

      switch (framework) {
        case 'react':
          ReactGenerator.create(classType, name, options);
          break;
        case 'backbone':
          BackboneGenerator.create(classType, name, options);
          break;
        default:
          echo('Invalid generator framework');
          break;
      }
    });
};

export default generate;
