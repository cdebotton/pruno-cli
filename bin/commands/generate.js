"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var inflection = _interopRequire(require("inflection"));

var compile = require("handlebars").compile;
var _fs = require("fs");

var readdirSync = _fs.readdirSync;
var readFileSync = _fs.readFileSync;
var join = require("path").join;
var _shelljs = require("shelljs");

var pwd = _shelljs.pwd;
var echo = _shelljs.echo;
var exit = _shelljs.exit;
var log = require("../logger").log;
var colors = _interopRequire(require("colors"));

var ReactGenerator = _interopRequire(require("../frameworks/react"));

var BackboneGenerator = _interopRequire(require("../frameworks/backbone"));

var generate = function (program) {
  return program.command("generate <action> <name>").alias("g").description("Generate a new component.").action(function (action, name, options) {
    var _action$split = action.split(":");

    var _action$split2 = _slicedToArray(_action$split, 2);

    var framework = _action$split2[0];
    var classType = _action$split2[1];
    var genDir = join(__dirname, "..", "frameworks", framework, "generators");
    try {
      var generators = readdirSync(genDir).map(function (gen) {
        return gen.split(".").shift().toLowerCase();
      });
    } catch (err) {
      echo("Framework '" + framework + "' isn't available.");
      exit(1);
    }

    switch (framework) {
      case "react":
        ReactGenerator.create(classType, name, options);
        break;
      case "backbone":
        BackboneGenerator.create(classType, name, options);
        break;
      default:
        echo("Invalid generator framework");
        break;
    }
  });
};

module.exports = generate;