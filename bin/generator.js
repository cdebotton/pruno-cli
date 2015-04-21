"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var compile = require("handlebars").compile;
var assign = _interopRequire(require("object-assign"));

var join = require("path").join;
var _shelljs = require("shelljs");

var pwd = _shelljs.pwd;
var rm = _shelljs.rm;
var cp = _shelljs.cp;
var _fs = require("fs");

var readFileSync = _fs.readFileSync;
var existsSync = _fs.existsSync;
var inflection = _interopRequire(require("inflection"));

var buildPath = _interopRequire(require("./utils/build-path"));

var Logger = _interopRequire(require("./logger"));

var colors = _interopRequire(require("colors"));

var Generator = (function () {
  function Generator() {
    _classCallCheck(this, Generator);

    throw new Error("Generator should not be instantiated, please use " + "the static methods that it provides.");
  }

  _prototypeProperties(Generator, {
    config: {
      value: function config(params) {
        var hbsPath = join(__dirname, "templates", "pruno.yaml.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        buildPath(params.config);
        Logger.log("Creating config file", join(params.config, "pruno.yaml").underline.yellow);
        tpl(params).to(join(params.config, "pruno.yaml"));
      },
      writable: true,
      configurable: true
    },
    packageJson: {
      value: function packageJson(params) {
        var hbsPath = join(__dirname, "templates", "package.json.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        var params = {
          name: pwd().split("/").pop(),
          author: "pruno",
          description: "New Pruno application",
          version: "0.1.0"
        };

        Logger.log("Creating", "package.json".yellow.underline);
        tpl(params).to("package.json");
      },
      writable: true,
      configurable: true
    },
    gulpfile: {
      value: function gulpfile(params) {
        var hbsPath = join(__dirname, "templates", "gulpfile.js.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);
        var _JSON$parse = JSON.parse(readFileSync(join(pwd(), "package.json")));

        var dependencies = _JSON$parse.dependencies;
        var devDependencies = _JSON$parse.devDependencies;
        var opts = {
          config: params.config.match(/^(?:\.)(.+)$/)[1],
          mixes: Object.keys(assign({}, dependencies || {}, devDependencies || {})).filter(function (mod) {
            return /^pruno\-(.+)/.exec(mod);
          }).map(function (mix) {
            return mix.match(/pruno\-(.+)$/)[1];
          }) || []
        };
        Logger.log("Creating gulpfile", join(pwd(), "gulpfile.js").underline.yellow);
        tpl(opts).to(join(pwd(), "gulpfile.js"));
      },
      writable: true,
      configurable: true
    },
    rc: {
      value: function rc(params) {
        var hbsPath = join(__dirname, "templates", ".prunorc.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        var params = {
          src: params.src,
          dist: params.dist,
          config: params.config,
          type: params.type.toLowerCase()
        };

        Logger.log("Creating", ".prunorc".yellow.underline);
        tpl(params).to(".prunorc");
      },
      writable: true,
      configurable: true
    },
    eslintrc: {
      value: function eslintrc(params) {
        var hbsPath = join(__dirname, "templates", ".eslintrc.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        Logger.log("Creating", ".eslintrc".yellow.underline);
        tpl().to(".eslintrc");
      },
      writable: true,
      configurable: true
    },
    sequelizerc: {
      value: function sequelizerc(params) {
        var hbsPath = join(__dirname, "templates", ".sequelizerc.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        Logger.log("Creating", ".sequelizerc".yellow.underline);
        tpl(params).to(".sequelizerc");
      },
      writable: true,
      configurable: true
    },
    serverRegister: {
      value: function serverRegister(params) {
        var hbsPath = join(__dirname, "frameworks/isomorphic/generators/serverRegister.js.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        Logger.log("Creating", "server.js".yellow.underline);
        tpl(params).to(join(pwd(), "server.js"));
      },
      writable: true,
      configurable: true
    },
    server: {
      value: function server(params) {
        var hbsPath = join(__dirname, "frameworks/isomorphic/generators/server.js.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        buildPath(params.api);
        buildPath(join(params.api, "controllers"));
        cp("-rf", join(__dirname, "frameworks/isomorphic/api/*"), join(pwd(), params.api));

        Logger.log("Creating", "$/{params.api}/index.js".yellow.underline);
        tpl(params).to(join(pwd(), params.api, "index.js"));
      },
      writable: true,
      configurable: true
    },
    dbAssets: {
      value: function dbAssets(params) {
        var hbsPath = join(__dirname, "frameworks/isomorphic/generators/models.js.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);

        buildPath(join(params.api, "models"));
        buildPath(join(params.api, "migrations"));

        Logger.log("Creating", "$/{params.api}/models/index.js".yellow.underline);
        tpl(params).to(join(pwd(), params.api, "models/index.js"));
      },
      writable: true,
      configurable: true
    },
    store: {
      value: function store(params) {
        var hbsPath = join(__dirname, "templates", "Store.js.hbs");
        var hbs = readFileSync(hbsPath).toString();
        var tpl = compile(hbs);
        var _require = require(join(pwd(), ".prunorc"));

        var src = _require.src;


        var params = {
          name: inflection.transform(params.name, ["classify", "singularize"]),
          actions: params.actions.map(function (act) {
            return inflection.transform("" + act + "_action_creators", ["classify", "singularize"]);
          })
        };

        Logger.log("Creating", ("" + src + "/stores/" + params.name + "Store.js").yellow.underline + ".");
        tpl(params).to(join(pwd(), src, "stores", "" + params.name + "Store.js"));
      },
      writable: true,
      configurable: true
    }
  });

  return Generator;
})();

module.exports = Generator;