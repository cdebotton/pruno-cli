"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var _reactRouter = require("react-router");

var Route = _reactRouter.Route;
var DefaultRoute = _reactRouter.DefaultRoute;
var App = _interopRequire(require("../components/App"));

var IndexRoute = _interopRequire(require("../routes/IndexRoute"));

var routes = React.createElement(
  Route,
  { handler: App },
  React.createElement(DefaultRoute, { name: "index", handler: IndexRoute })
);

module.exports = routes;