"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var flux = _interopRequire(require("../flux"));

var AppActionCreators = function AppActionCreators() {
  _classCallCheck(this, AppActionCreators);

  this.generateActions("toggle", "activate", "deactivate");
};

module.exports = flux.createActions(AppActionCreators);