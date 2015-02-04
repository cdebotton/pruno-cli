"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var inquirer = _interopRequire(require("inquirer"));

var inflection = _interopRequire(require("inflection"));

var assign = _interopRequire(require("object-assign"));

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var Handlebars = _interopRequire(require("handlebars"));

var _shelljs = require("shelljs");

var pwd = _shelljs.pwd;
var mkdir = _shelljs.mkdir;
var log = require("../../logger").log;
var ReactGenerator = (function () {
  function ReactGenerator() {
    _classCallCheck(this, ReactGenerator);
  }

  _prototypeProperties(ReactGenerator, null, {
    create: {
      value: function create(classType, name, options) {
        try {
          this.config = require(path.join(pwd(), ".prunorc"));
        } catch (err) {
          throw new Error("Pruno has not properly been initialized. Please run " + "`pruno new` in the root of your project.");
        }

        this.ensurePath(classType);

        var CREATE_STRING = "onCreate" + (classType.charAt(0).toUpperCase() + classType.slice(1));

        this.options = options || {};

        var hasMethod = Object.getOwnPropertyNames(ReactGenerator.prototype).indexOf(CREATE_STRING) > -1;

        if (!hasMethod) {
          throw new Error("Invalid generator class type " + classType + ", " + ("ReactGenerator has no method " + CREATE_STRING));
        }

        this[CREATE_STRING](name, options);
      },
      writable: true,
      configurable: true
    },
    onCreateComponent: {
      value: function onCreateComponent(name, options) {
        var _this = this;
        var componentName = inflection.titleize(name).replace(/\W/g, "");
        var className = inflection.transform(componentName, ["underscore", "dasherize"]);
        var stores = fs.readdirSync(path.join(pwd(), this.config.src, "stores")).filter(function (file) {
          return /\.js$/.exec(file);
        }).map(function (file) {
          return file.match(/^(.+)\.js$/)[1];
        });

        try {
          var mixins = fs.readdirSync(path.join(pwd(), this.config.src, "mixins")).filter(function (file) {
            return /\.js$/.exec(file);
          }).map(function (file) {
            return file.match(/^(.+)\.js$/)[1];
          });
        } catch (err) {
          var mixins = [];
        }

        inquirer.prompt([{
          name: "stores",
          type: "checkbox",
          message: "Would you like to listen to any stores?",
          choices: stores,
          when: function () {
            return stores.length > 0;
          }
        }, {
          name: "mixins",
          type: "checkbox",
          message: "Would you like to listen to any mixins?",
          choices: mixins,
          when: function () {
            return mixins.length > 0;
          }
        }], function (params) {
          params.stores || (params.stores = []);
          params.mixins || (params.mixins = []);

          if (params.stores.length > 0) {
            params.mixins.push("StoreListenerMixin");
          }

          var opts = assign({ componentName: componentName, className: className }, {
            stores: params.stores,
            mixins: params.mixins.join(", ")
          });

          var contents = _this.renderData("Component.js.hbs", opts);

          fs.writeFileSync(path.join(pwd(), _this.config.src, "components", componentName + ".js"), contents);
        });
      },
      writable: true,
      configurable: true
    },
    renderData: {
      value: function renderData(tplFile, opts) {
        var hbsPath = path.join(__dirname, "generators", tplFile);
        var hbs = fs.readFileSync(hbsPath).toString();
        var template = Handlebars.compile(hbs);
        var contents = template(opts);

        return contents;
      },
      writable: true,
      configurable: true
    },
    ensurePath: {
      value: function ensurePath(classType) {
        var pathPart = (function () {
          switch (classType) {
            case "component":
              return "components";
            case "actions":
              return "actions";
            case "mixin":
              return "mixins";
            case "store":
              return "stores";
            case "route":
              return "routes";
          }
        })();

        var target = path.join(pwd(), this.config.src, pathPart);

        if (!fs.existsSync(target)) {
          log("Creating directory", target.yellow.underline + ".");
          mkdir(target);
        }
      },
      writable: true,
      configurable: true
    }
  });

  return ReactGenerator;
})();

Handlebars.registerHelper("camelcase", function (str) {
  return inflection.camelize(str, true);
});

module.exports = new ReactGenerator();