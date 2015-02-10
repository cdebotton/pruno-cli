"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var assign = _interopRequire(require("object-assign"));

var path = _interopRequire(require("path"));

var save = require("../utils/install").save;
var pwd = require("shelljs").pwd;
var spawn = require("child_process").spawn;


var db = function (program) {
  var env = assign({}, process.env, {
    PATH: path.join(pwd(), "node_modules/.bin") + ":" + process.env.PATH
  });

  program.command("db:install <dbType>").description("Install Sequelize and setup database").action(function (dbType) {
    spawn("sequelize", ["init"], {
      stdio: "inherit",
      env: env,
      cwd: pwd()
    });
  });

  program.command("db:migration <migrationName>").description("Create a new SQL migration.").action(function (migrationName) {
    var migration = spawn("sequelize", ["migration:create", "--name=" + migrationName], {
      stdio: "inherit",
      env: env,
      cwd: pwd()
    });
  });

  program.command("db:migrate").description("Run all pending migrations.").action(function () {});

  program.command("db:rollback").description("Roll back migrations").action(function () {});

  return program;
};
module.exports = db;