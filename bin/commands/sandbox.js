"use strict";

var sandbox = function (program) {
  return program.command("sandbox").description("Start up a sandbox session and interact with your application via the CLI.");
};


module.exports = sandbox;