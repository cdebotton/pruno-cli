"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var addMixes = _interopRequire(require("../utils/add-mixes"));

var install = function (program) {
  return program.command("install <mixes...>").alias("i").description("Install and configure a new pruno-mix.").action(addMixes);
};

module.exports = install;