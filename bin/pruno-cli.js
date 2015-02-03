"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var program = _interopRequire(require("commander"));

var requireDir = _interopRequire(require("require-dir"));

var _require = require("../package.json");

var version = _require.version;


program.version(version);

var commands = requireDir("./commands");

Object.keys(commands).forEach(function (cmd) {
  commands[cmd](program);
});

program.parse(process.argv);