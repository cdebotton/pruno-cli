"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var AppActionCreators = _interopRequire(require("../actions/AppActionCreators"));

var flux = _interopRequire(require("../flux"));

var AppStore = (function () {
  function AppStore() {
    _classCallCheck(this, AppStore);

    this.bindActions(AppActionCreators);
    this.toggle = false;
  }

  _prototypeProperties(AppStore, null, {
    onToggle: {
      value: function onToggle() {
        var data = arguments[0] === undefined ? {} : arguments[0];
        this.toggle = !this.toggle;
      },
      writable: true,
      configurable: true
    },
    onActivate: {
      value: function onActivate() {
        var data = arguments[0] === undefined ? {} : arguments[0];
        this.toggle = true;
      },
      writable: true,
      configurable: true
    },
    onDeactivate: {
      value: function onDeactivate() {
        var data = arguments[0] === undefined ? {} : arguments[0];
        this.toggle = false;
      },
      writable: true,
      configurable: true
    }
  });

  return AppStore;
})();

module.exports = flux.createStore(AppStore);