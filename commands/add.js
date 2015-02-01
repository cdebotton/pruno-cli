import YAML from "js-yaml";
import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {pwd} from "shelljs";
import {log} from "../logger";
import {saveDev} from "../utils/install";
import Generator from "../generator";

let add = (program) => program.command('add <mixes...>')
  .description('Install and configure a new pruno-mix.')
  .action(mixes => {
    let packages = mixes.map(mix => `pruno-${mix}`);
    let {config, src, dist} = require(join(pwd(), '.prunorc'));
    let yamlPath = join(pwd(), config, 'pruno.yaml');
    let gulpfilePath = join(pwd(), 'gulpfile.js');
    let opts = YAML.safeLoad(readFileSync(yamlPath), 'utf-8');
    let gulpfile = readFileSync(gulpfilePath).toString();

    saveDev(packages)
      .then(data => {
        packages.forEach(pkg => {
          let pkgPath = join(pwd(), 'node_modules', pkg);
          let json = join(pkgPath, 'package.json');
          let {main} = require(json);
          let Task = require(join(pkgPath, main));
          let defaults = Task.getDefaults();
          let mix = pkg.match(/pruno\-(.+)$/)[1];

          opts[mix] = defaults;
        });
        let yaml = YAML.safeDump(opts);
        writeFileSync(yamlPath, yaml);
        Generator.gulpfile({config});
      })
      .catch(err => console.error(err));
  });

export default add;
