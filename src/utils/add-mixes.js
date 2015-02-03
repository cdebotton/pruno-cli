import YAML from "js-yaml";
import assign from "object-assign";
import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {pwd} from "shelljs";
import {log} from "../logger";
import {saveDev} from "../utils/install";
import Generator from "../generator";

export default (mixes, options = {}) => {
  var packages = mixes.map(mix => `pruno-${mix}`);
  var {config, src, dist} = require(join(pwd(), '.prunorc'));
  var yamlPath = join(pwd(), config, 'pruno.yaml');
  var gulpfilePath = join(pwd(), 'gulpfile.js');
  var yamlFile = readFileSync(yamlPath);
  var opts = YAML.safeLoad(yamlFile);

  var params = assign({}, options, {config, src, dist});

  saveDev(packages)
    .then(data => {
      packages.forEach(pkg => {
        var pkgPath = join(pwd(), 'node_modules', pkg);
        var json = join(pkgPath, 'package.json');
        var {main} = require(json);
        var Task = require(join(pkgPath, main));
        var defaults = Task.getDefaults();
        var mix = pkg.match(/pruno\-(.+)$/)[1];
        opts[mix] = defaults;
        if (options[mix]) {
          assign(opts[mix], options[mix]);
        }
      });
      var yaml = YAML.safeDump(opts);
      writeFileSync(yamlPath, yaml);
      Generator.gulpfile(params);
    })
    .catch(err => console.error(err));
};
