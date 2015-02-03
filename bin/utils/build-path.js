"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var join = require("path").join;
var _shelljs = require("shelljs");

var mkdir = _shelljs.mkdir;
var pwd = _shelljs.pwd;
var cd = _shelljs.cd;
var existsSync = require("fs").existsSync;
var Logger = _interopRequire(require("../logger"));

module.exports = function (target, callback) {
  try {
    var path = join(pwd(), target);

    path.split("/").reduce(function (memo, part) {
      memo = join(memo, part);
      var exists = existsSync(memo);

      if (!exists) {
        mkdir(memo);
        Logger.log("Creating directory", memo.underline.yellow);
      }

      return memo;
    }, "/");

    if (callback) callback(null, path);
  } catch (err) {
    if (callback) callback(err, null);
  }
};