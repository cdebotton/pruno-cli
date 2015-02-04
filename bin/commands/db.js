"use strict";

var save = require("../utils/install").save;
var pwd = require("shelljs").pwd;


var db = function (program) {
  program.command("db:install <dbType>").description("Install Sequelize and setup database").action(function (dbType) {});

  program.command("db:migration <migrationName>").description("Create a new SQL migration.");

  program.command("db:migrate").description("Run all pending migrations.");

  program.command("db:rollback").description("Roll back migrations");

  return program;
};
module.exports = db;