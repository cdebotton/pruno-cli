"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var _reactRouter = require("react-router");

var ReactRouter = _interopRequire(_reactRouter);

var routes = _interopRequire(require("./routes"));

var HistoryLocation = _reactRouter.HistoryLocation;


ReactRouter.run(routes, HistoryLocation, function (Handler, state) {
  React.render(React.createElement(Handler, {
    params: state.params,
    query: state.query }), document.getElementById("app-mount"));
});