"use strict";

import inflection from "inflection";
import {compile} from "handlebars";
import {readdirSync, readFileSync} from "fs";
import {join} from "path";
import {pwd, echo, exit} from "shelljs";
import {log} from "../logger";
import colors from "colors";

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

      try {
        let hbsPath = join(genDir, `${classType}.js.hbs`);
        let hbs = readFileSync(hbsPath).toString();
        var template = compile(hbs);
      }
      catch (err) {
        echo(`Framework '${framework}' doesn't have a generator named '${classType}'`);
        exit(1);
      }

      var params = Object.assign({}, options, {
        name: inflection.transform(name, ['singularize', 'classify']),
        tplName: name
      });

      var scaffold= template(params);
      console.log(scaffold);
    });
};

export default generate;
