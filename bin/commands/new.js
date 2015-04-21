"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var inquirer = _interopRequire(require("inquirer"));

var existsSync = require("fs").existsSync;
var _path = require("path");

var resolve = _path.resolve;
var join = _path.join;
var _shelljs = require("shelljs");

var pwd = _shelljs.pwd;
var echo = _shelljs.echo;
var exit = _shelljs.exit;
var log = require("../logger").log;
var _utilsInstall = require("../utils/install");

var saveDev = _utilsInstall.saveDev;
var save = _utilsInstall.save;
var Generator = _interopRequire(require("../generator"));

var scaffolder = _interopRequire(require("../utils/scaffolder"));

var init = function (program) {
  return program.command("new").description("Initialize Pruno for this project.").alias("n").action(function () {
    if (existsSync(join(pwd(), ".prunorc"))) {
      echo("Pruno has already been initialized in this directory.");
      exit(1);
    }
    inquirer.prompt([{
      type: "list",
      name: "type",
      message: "What type of project would you like to create?",
      choices: ["Basic", new inquirer.Separator(), "React", "Backbone"],
      "default": "Basic"
    }, {
      type: "input",
      name: "src",
      message: "Where would you like your source assets to be read from?",
      "default": "./src"
    }, {
      type: "input",
      name: "dist",
      message: "Where would you like compiled assets to be stored?",
      "default": "./dist"
    }, {
      type: "input",
      name: "config",
      message: "Where would you like to store your app config yaml files?",
      "default": "./config"
    }], function (params) {
      log("Initializing pruno.");
      // Create .prunorc file
      Generator.rc(params);

      // Create package.json file
      Generator.packageJson(params);

      // Generate gulpfile.js
      Generator.gulpfile(params);

      // Generate config file
      Generator.config(params);

      // Generate .eslintrc file
      Generator.eslintrc(params);

      // Scaffold React project
      scaffolder(params.type, params);

      saveDev(["pruno", "gulp"]);
    });
  });
};

module.exports = init;