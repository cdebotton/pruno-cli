"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var inflection = _interopRequire(require("inflection"));

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var Handlebars = _interopRequire(require("handlebars"));

var pwd = require("shelljs").pwd;
var log = require("../../logger").log;
var BackboneGenerator = (function () {
  function BackboneGenerator() {
    _classCallCheck(this, BackboneGenerator);
  }

  _prototypeProperties(BackboneGenerator, null, {
    create: {
      value: function create(classType, name, options) {
        var CREATE_STRING = "onCreate" + (classType.charAt(0).toUpperCase() + classType.slice(1));

        this.config = require(path.join(pwd(), ".prunorc"));
        this.options = options || {};

        var hasMethod = Object.getOwnPropertyNames(BackboneGenerator.prototype).indexOf(CREATE_STRING) > -1;

        if (!hasMethod) {
          throw new Error("Invalid generator class type " + classType + ", " + ("BackboneGenerator has no method " + CREATE_STRING));
        }

        this[CREATE_STRING](name, options);
      },
      writable: true,
      configurable: true
    },
    onCreateModel: {
      value: function onCreateModel(name, options) {
        var modelName = inflection.transform(name, ["classify", "singularize"]) + "Model";

        var opts = {
          modelName: modelName
        };

        var contents = this.renderData("Model.js.hbs", opts);

        fs.writeFileSync(path.join(pwd(), this.config.src, "models", "" + modelName + ".js"), contents);

        log("Created", ("" + this.config.src + "/models/" + modelName + ".js").yellow.underline);
      },
      writable: true,
      configurable: true
    },
    onCreateCollection: {
      value: function onCreateCollection(name, options) {
        var collectionName = inflection.transform(name, ["classify", "pluralize"]) + "Collection";
        var modelName = inflection.transform(name, ["classify", "singularize"]) + "Model";
        var opts = { modelName: modelName };
        var hasModel = fs.existsSync(path.join(pwd(), this.config.src, "models", "" + modelName + ".js"));

        if (!hasModel) {
          this.onCreateModel(name, options);
        }

        var contents = this.renderData("Collection.js.hbs", opts);

        fs.writeFileSync(path.join(pwd(), this.config.src, "collections", "" + collectionName + ".js"), contents);

        log("Created", ("" + this.config.src + "/collections/" + collectionName + ".js").yellow.underline);
      },
      writable: true,
      configurable: true
    },
    onCreateView: {
      value: function onCreateView(name, options) {},
      writable: true,
      configurable: true
    },
    onCreateTemplate: {
      value: function onCreateTemplate(name, options) {},
      writable: true,
      configurable: true
    },
    onCreateRouter: {
      value: function onCreateRouter(name, options) {},
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
    }
  });

  return BackboneGenerator;
})();

module.exports = new BackboneGenerator();