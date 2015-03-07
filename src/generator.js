import {compile} from "handlebars";
import assign from "object-assign";
import {join} from "path";
import {pwd, rm, cp} from "shelljs";
import {readFileSync, existsSync} from "fs";
import inflection from "inflection";
import buildPath from "./utils/build-path";
import Logger from "./logger";
import colors from "colors";

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

    Logger.log('Creating', 'package.json'.yellow.underline);
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
      config: params.config,
      type: params.type.toLowerCase(),
      db: params.db,
      dbType: params.dbType.toLowerCase(),
      koa: params.koa,
      api: params.api
    };

    Logger.log('Creating', '.prunorc'.yellow.underline);
    tpl(params).to('.prunorc');
  }

  static eslintrc(params) {
    let hbsPath = join(__dirname, 'templates', '.eslintrc.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    Logger.log('Creating', '.eslintrc'.yellow.underline);
    tpl().to('.eslintrc');
  }

  static sequelizerc(params) {
    let hbsPath = join(__dirname, 'templates', '.sequelizerc.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    Logger.log('Creating', '.sequelizerc'.yellow.underline);
    tpl(params).to('.sequelizerc');
  }

  static serverRegister(params) {
    let hbsPath = join(__dirname, 'frameworks/isomorphic/generators/serverRegister.js.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    Logger.log('Creating', 'server.js'.yellow.underline);
    tpl(params).to(join(pwd(), 'server.js'));
  }

  static server(params) {
    let hbsPath = join(__dirname, 'frameworks/isomorphic/generators/server.js.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    buildPath(params.api);
    buildPath(join(params.api, 'controllers'));
    cp(
      '-rf',
      join(__dirname, 'frameworks/isomorphic/api/*'),
      join(pwd(), params.api)
    );

    Logger.log('Creating', `$/{params.api}/index.js`.yellow.underline);
    tpl(params).to(join(pwd(), params.api, 'index.js'));
  }

  static dbAssets(params) {
    let hbsPath = join(__dirname, 'frameworks/isomorphic/generators/models.js.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);

    buildPath(join(params.api, 'models'));
    buildPath(join(params.api, 'migrations'));

    Logger.log('Creating', `$/{params.api}/models/index.js`.yellow.underline);
    tpl(params).to(join(pwd(), params.api, 'models/index.js'));
  }

  constructor() {
    throw new Error(
      'Generator should not be instantiated, please use ' +
      'the static methods that it provides.'
    );
  }

  static store(params) {
    let hbsPath = join(__dirname, 'templates', 'Store.js.hbs');
    let hbs = readFileSync(hbsPath).toString();
    let tpl = compile(hbs);
    let {src} = require(join(pwd(), '.prunorc'));

    var params = {
      name: inflection.transform(params.name, ['classify', 'singularize']),
      actions: params.actions.map(act => {
        return inflection.transform(`${act}_action_creators`, ['classify', 'singularize']);
      })
    };

    Logger.log('Creating', `${src}/stores/${params.name}Store.js`.yellow.underline + '.');
    tpl(params).to(join(pwd(), src, 'stores', `${params.name}Store.js`));
  }
}
