"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var colors = _interopRequire(require("colors"));

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);

    throw new Error("Generator should not be instantiated, please use " + "the static methods that it provides.");
  }

  _prototypeProperties(Logger, {
    log: {
      value: function log() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        console.log.apply(console, ["[pruno]".green].concat(args));
      },
      writable: true,
      configurable: true
    }
  });

  return Logger;
})();

module.exports = Logger;