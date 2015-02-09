"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _shelljs = require("shelljs");

var pwd = _shelljs.pwd;
var cp = _shelljs.cp;
var mv = _shelljs.mv;
var join = require("path").join;
var log = require("../logger").log;
var _utilsInstall = require("../utils/install");

var save = _utilsInstall.save;
var saveDev = _utilsInstall.saveDev;
var buildPath = _interopRequire(require("../utils/build-path"));

var addMixes = _interopRequire(require("../utils/add-mixes"));

var Generator = _interopRequire(require("../generator"));

module.exports = function (scaffold, options) {
  switch (scaffold.toLowerCase()) {
    case "backbone":
      generateBackbone(options);
      break;
    case "react":
      generateReact(options);
      break;
    default:
      generateDefaults(options);
      break;
  }
};

var generateReact = function (options) {
  save(["react", "react-router", "fluxd"]).then(function () {
    return log("Installed front-end assets for React.");
  })["catch"](function (err) {
    return log(err);
  });

  addMixes(["del", "js", "stylus", "http", "publish", "jade"], {
    js: { es6: true },
    stylus: { normalize: true, "font-awesome": true }
  });

  cp("-Rf", join(__dirname, "..", "frameworks", "react", "app", "*"), join(pwd(), options.src));
};

var generateBackbone = function (options) {
  save(["backbone", "jquery", "lodash"]).then(function () {
    return log("Installed front-end assets for Backbone.");
  })["catch"](function (err) {
    return log(err);
  });

  saveDev(["hbsfy", "handlebars"]);

  addMixes(["del", "js", "stylus", "http", "publish", "jade"], {
    js: { es6: true, handlebars: true },
    stylus: { normalize: true, "font-awesome": true }
  });

  cp("-Rf", join(__dirname, "..", "frameworks", "backbone", "app", "*"), join(pwd(), options.src));
};

var generateDefaults = function (options) {
  cp("-Rf", join(__dirname, "..", "frameworks", "defaults", "app", "*"), join(pwd(), options.src));
};