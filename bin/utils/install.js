"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var spawn = require("child_process").spawn;
var colors = _interopRequire(require("colors"));

var log = require("../logger").log;
var Promise = _interopRequire(require("bluebird"));

var save = exports.save = function (packages) {
  return install("--save", packages);
};

var saveDev = exports.saveDev = function (packages) {
  return install("--save-dev", packages);
};

var install = function (method, packages) {
  packages = Array.isArray(packages) ? packages : [packages];

  var deps = packages.map(function (pkg) {
    return pkg.yellow.underline;
  }).join(", ");

  log("Installing", deps, "with ", method.green);

  return new Promise(function (resolve, reject) {
    spawn("npm", ["install", method].concat(packages), { stdio: false }).on("exit", function (err, response) {
      if (err) reject(err);
      log("Installed", deps, "with ", method.green);
      resolve(response);
    });
  });
};
exports.__esModule = true;