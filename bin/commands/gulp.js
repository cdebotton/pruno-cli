"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var pwd = require("shelljs").pwd;
var spawn = require("child_process").spawn;
var assign = _interopRequire(require("object-assign"));

module.exports = function (program) {
  program.command("watch [env]").alias("w").description("Run the tasks registered for watching. Proxies `gulp watch`.").action(function () {
    var env = arguments[0] === undefined ? "development" : arguments[0];
    var env = assign({}, process.env, { NODE_ENV: env });
    var watcher = spawn("gulp", ["watch"], {
      stdio: "inherit",
      env: env,
      cwd: pwd()
    });
  });

  program.command("build [env]").alias("b").description("Run the default registered tasks. Proxies `gulp`.").action(function () {
    var env = arguments[0] === undefined ? "develoment" : arguments[0];
    var env = assign({}, process.env, { NODE_ENV: env });
    var watcher = spawn("gulp", [], {
      stdio: "inherit",
      env: env,
      cwd: pwd()
    });
  });
};