import YAML from "js-yaml";
import assign from "object-assign";
import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {pwd} from "shelljs";
import {log} from "../logger";
import {saveDev} from "../utils/install";
import Generator from "../generator";

export default (mixes, options = {}) => {
  let packages = mixes.map(mix => `pruno-${mix}`);
  let {config, src, dist} = require(join(pwd(), '.prunorc'));
  let yamlPath = join(pwd(), config, 'pruno.yaml');
  let gulpfilePath = join(pwd(), 'gulpfile.js');
  let opts = YAML.safeLoad(readFileSync(yamlPath), 'utf-8');

  let params = assign({}, options, {config, src, dist});

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
        if (options[mix]) {
          assign(opts[mix], options[mix]);
        }
      });
      let yaml = YAML.safeDump(opts);
      writeFileSync(yamlPath, yaml);
      Generator.gulpfile(params);
    })
    .catch(err => console.error(err));
};
