"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var YAML = _interopRequire(require("js-yaml"));

var assign = _interopRequire(require("object-assign"));

var _fs = require("fs");

var readFileSync = _fs.readFileSync;
var writeFileSync = _fs.writeFileSync;
var join = require("path").join;
var pwd = require("shelljs").pwd;
var log = require("../logger").log;
var saveDev = require("../utils/install").saveDev;
var Generator = _interopRequire(require("../generator"));

module.exports = function (mixes) {
  var options = arguments[1] === undefined ? {} : arguments[1];
  var packages = mixes.map(function (mix) {
    return "pruno-" + mix;
  });
  var _require = require(join(pwd(), ".prunorc"));

  var config = _require.config;
  var src = _require.src;
  var dist = _require.dist;
  var yamlPath = join(pwd(), config, "pruno.yaml");
  var gulpfilePath = join(pwd(), "gulpfile.js");
  var yamlFile = readFileSync(yamlPath);
  var opts = YAML.safeLoad(yamlFile);

  var params = assign({}, options, { config: config, src: src, dist: dist });

  saveDev(packages).then(function (data) {
    packages.forEach(function (pkg) {
      var pkgPath = join(pwd(), "node_modules", pkg);
      var json = join(pkgPath, "package.json");
      var _require2 = require(json);

      var main = _require2.main;
      var Task = require(join(pkgPath, main));
      var defaults = Task.getDefaults();
      var mix = pkg.match(/pruno\-(.+)$/)[1];
      opts[mix] = defaults;
      if (options[mix]) {
        assign(opts[mix], options[mix]);
      }
    });
    var yaml = YAML.safeDump(opts);
    writeFileSync(yamlPath, yaml);
    Generator.gulpfile(params);
  })["catch"](function (err) {
    return console.error(err);
  });
};