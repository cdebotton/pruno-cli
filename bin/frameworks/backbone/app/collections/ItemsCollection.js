"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Collection = require("backbone").Collection;
var ItemModel = _interopRequire(require("../models/ItemModel"));

module.exports = Collection.extend({
  model: ItemModel
});