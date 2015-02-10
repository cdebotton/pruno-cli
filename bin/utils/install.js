"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var spawn = require("child_process").spawn;
var colors = _interopRequire(require("colors"));

var log = require("../logger").log;
var Promise = _interopRequire(require("bluebird"));

var save = exports.save = function (packages) {
  return install("--save", packages, "install");
};

var saveDev = exports.saveDev = function (packages) {
  return install("--save-dev", packages, "install");
};

var rmSave = exports.rmSave = function (packages) {
  return install("--save", packages, "uninstall");
};

var rmSaveDev = exports.rmSaveDev = function (packages) {
  return install("--save-dev", packages, "uninstall");
};

var install = function (method, packages) {
  var action = arguments[2] === undefined ? "install" : arguments[2];
  packages = Array.isArray(packages) ? packages : [packages];

  var deps = packages.map(function (pkg) {
    return pkg.yellow.underline;
  }).join(", ");

  log(action === "install" ? "Installing" : "Uninstalling", deps, "with ", method.green);

  return new Promise(function (resolve, reject) {
    spawn("npm", [action, method].concat(packages), { stdio: false }).on("exit", function (err, response) {
      if (err) reject(err);
      log("Installed", deps, "with ", method.green);
      resolve(response);
    });
  });
};
exports.__esModule = true;