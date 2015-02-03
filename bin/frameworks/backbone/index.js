"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var BackboneGenerator = (function () {
  function BackboneGenerator() {
    _classCallCheck(this, BackboneGenerator);
  }

  _prototypeProperties(BackboneGenerator, null, {
    create: {
      value: function create(classType, name, options) {
        var CREATE_STRING = "onCreate" + (classType.charAt(0).toUpperCase() + classType.slice(1));

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
      value: function onCreateModel(name, options) {},
      writable: true,
      configurable: true
    },
    onCreateCollection: {
      value: function onCreateCollection(name, options) {},
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
    }
  });

  return BackboneGenerator;
})();

module.exports = new BackboneGenerator();