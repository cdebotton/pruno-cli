"use strict";

var uninstall = function (program) {
  return program.command("uninstall <mixes...>").alias("rm").description("Remove pruno mixes.").action(function (mixes, options) {});
};

module.exports = uninstall;