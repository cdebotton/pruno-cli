"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var program = _interopRequire(require("commander"));

var requireDir = _interopRequire(require("require-dir"));

var colors = _interopRequire(require("colors"));

var _require = require("../package.json");

var version = _require.version;


program.version(version);

var commands = requireDir("./commands");

Object.keys(commands).forEach(function (cmd) {
  commands[cmd](program);
});

program.on("--help", function () {
  console.log("  " + "Generators:".yellow.underline.bold);
  console.log("");
  console.log("    " + "React:".yellow.underline.bold);
  console.log("      " + "☁".cyan + " pruno g " + "react:component".green.bold + " " + "<componentName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "react:actions".green.bold + " " + "<actionsName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "react:store".green.bold + " " + "<storeName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "react:mixin".green.bold + " " + "<mixinName>".yellow.bold);
  console.log("");
  console.log("    " + "Backbone:".yellow.underline.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:router".green.bold + " " + "<routerName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:view".green.bold + " " + "<viewName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:template".green.bold + " " + "<templateName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:model".green.bold + " " + "<modelName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:collection".green.bold + " " + "<collectionName>".yellow.bold);
  console.log("      " + "☁".cyan + " pruno g " + "backbone:helper".green.bold + " " + "<helperName>".yellow.bold);

});

program.parse(process.argv);