import {compile} from "handlebars";
import assign from "object-assign";
import {join} from "path";
import {pwd, rm} from "shelljs";
import buildPath from "./utils/build-path";
import {readFileSync, existsSync} from "fs";
import Logger from "./logger";

export default class Generator {
  static config(params) {
    let hbsPath = join(__dirname, 'templates', 'pruno.yaml.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    buildPath(params.config);
    Logger.log('Creating config file', join(params.config, 'pruno.yaml').underline.yellow);
    tpl(params).to(join(params.config, 'pruno.yaml'));
  }

  static packageJson(params) {
    let hbsPath = join(__dirname, 'templates', 'package.json.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    let params = {
      name: pwd().split('/').pop(),
      author: 'pruno',
      description: 'New Pruno application',
      version: "0.1.0"
    };

    Logger.log('Creating package.json');
    tpl(params).to('package.json');
  }

  static gulpfile(params) {
    let hbsPath = join(__dirname, 'templates', 'gulpfile.js.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);
    let {dependencies, devDependencies} = JSON.parse(
      readFileSync(join(pwd(), 'package.json'))
    );
    let opts = {
      config: params.config.match(/^(?:\.)(.+)$/)[1],
      mixes: Object.keys(
          assign({}, (dependencies || {}), (devDependencies || {})
        ))
        .filter(mod => /^pruno\-(.+)/.exec(mod))
        .map(mix => mix.match(/pruno\-(.+)$/)[1]) || []
    };
    Logger.log('Creating gulpfile', join(pwd(), 'gulpfile.js').underline.yellow);
    tpl(opts).to(join(pwd(), 'gulpfile.js'));
  }

  static rc(params) {
    let hbsPath = join(__dirname, 'templates', '.prunorc.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    let params = {
      src: params.src,
      dist: params.dist,
      config: params.config
    };

    Logger.log('Creating .prunorc');
    tpl(params).to('.prunorc');
  }

  constructor() {
    throw new Error(
      'Generator should not be instantiated, please use ' +
      'the static methods that it provides.'
    );
  }
}
