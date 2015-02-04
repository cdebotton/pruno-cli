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
        }, {
          name: "isRouteHandler",
          type: "confirm",
          message: "Is this component a route handler?",
          "default": false
        }], function (params) {
          params.stores || (params.stores = []);
          params.mixins || (params.mixins = []);

          if (params.stores.length > 0) {
            params.mixins.push("StoreListenerMixin");
          }

          if (params.isRouteHandler) {
            params.mixins.push("RouterStateMixin");
            componentName += "Route";
          }

          var opts = assign({ componentName: componentName, className: className }, {
            stores: params.stores,
            mixins: params.mixins.join(", "),
            isRouteHandler: params.isRouteHandler
          });

          var contents = _this.renderData("Component.js.hbs", opts);

          if (params.isRouteHandler) {
            _this.ensurePath("route");
            var componentType = "routes";
          } else {
            var componentType = "components";
          }

          var target = path.join(pwd(), _this.config.src, componentType, componentName + ".js");

          fs.writeFileSync(target, contents);

          log("Created", target.yellow.underline + ".");
        });
      },
      writable: true,
      configurable: true
    },
    onCreateStore: {
      value: function onCreateStore(name, options) {
        var _this = this;
        var storeName = inflection.transform(name.replace(/-/g, "_"), ["classify"]) + "Store";
        var actions = fs.readdirSync(path.join(pwd(), this.config.src, "actions")).filter(function (file) {
          return /\.js$/.exec(file);
        }).map(function (file) {
          return file.replace(/\.js$/, "");
        });

        inquirer.prompt([{
          name: "actions",
          type: "checkbox",
          choices: actions,
          message: "Would you like to bind any actions?"
        }], function (params) {
          params.actions || (params.actions = []);
          var opts = {};
          var actionList = [];

          var actions = params.actions.reduce(function (memo, actionFile) {
            var actionData = fs.readFileSync(path.join(pwd(), _this.config.src, "actions", actionFile + ".js")).toString().split(/[\r\n]/);

            var searching = false;

            while (actionData.length > 0) {
              var line = actionData.shift();

              if (line.match(/generateActions\(/)) {
                searching = true;
              }

              if (searching && /'(.+)'/.exec(line)) {
                actionList.push(/'(.+)'/.exec(line)[1]);
              }

              if (line.match(/\);/)) {
                searching = false;
              }
            }
          }, []);

          opts.actions = params.actions;
          opts.actionItems = actionList;
          opts.storeName = storeName;

          var contents = _this.renderData("Store.js.hbs", opts);
          var target = path.join(pwd(), _this.config.src, "stores", storeName + ".js");

          fs.writeFileSync(target, contents);

          log("Created", target.yellow.underline + ".");
        });
      },
      writable: true,
      configurable: true
    },
    onCreateActions: {
      value: function onCreateActions(name, options) {
        var _this = this;
        var actionsName = inflection.transform(name.replace(/-/g, "_"), ["classify"]) + "ActionCreators";

        inquirer.prompt([{
          name: "actions",
          type: "input",
          message: "What actions would you like to generate? (Separate with spaces)"
        }], function (params) {
          var opts = {
            actionsName: actionsName,
            actions: params.actions ? params.actions.split(" ") : false
          };

          var contents = _this.renderData("ActionCreator.js.hbs", opts);
          var target = path.join(pwd(), _this.config.src, "actions", actionsName + ".js");

          fs.writeFileSync(target, contents);

          log("Created", target.yellow.underline + ".");
        });
      },
      writable: true,
      configurable: true
    },
    onCreateMixin: {
      value: function onCreateMixin(name, options) {
        var _this = this;
        var mixinName = inflection.transform(name.replace(/\-/g, "_"), ["titleize"]).replace(/\s/g, "") + "Mixin";

        inquirer.prompt([{
          type: "confirm",
          name: "takesParams",
          message: "Does this mixin take parameters?"
        }], function (params) {
          var takesParams = params.takesParams;
          var opts = { mixinName: mixinName, takesParams: takesParams };
          var contents = _this.renderData("Mixin.js.hbs", opts);
          var target = path.join(pwd(), _this.config.src, "mixins", "" + mixinName + ".js");

          fs.writeFileSync(target, contents);
          log("Created", target.yellow.underline + ".");
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

Handlebars.registerHelper("actionify", function (str) {
  return "on" + str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper("storeState", function (str) {
  return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/Store$/, "");
});

module.exports = new ReactGenerator();