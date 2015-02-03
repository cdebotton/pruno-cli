"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _backbone = require("backbone");

var Backbone = _interopRequire(_backbone);

var history = _backbone.history;
var $ = _interopRequire(require("jquery"));

var AppView = _interopRequire(require("./views/AppView"));

var AppModel = _interopRequire(require("./models/AppModel"));

var AppRouter = _interopRequire(require("./routers/AppRouter"));

Backbone.$ = $;
var application = new AppView({
  model: new AppModel()
});

history.start({ pushState: false });