"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var View = require("backbone").View;
var router = _interopRequire(require("../routers/AppRouter"));

var ItemsCollection = _interopRequire(require("../collections/ItemsCollection"));

var items = new ItemsCollection([{ name: "Item 1" }, { name: "Item 2" }, { name: "Item 3" }]);

module.exports = View.extend({
  el: "#route-handler",
  template: require("../hbs/index.hbs"),

  events: {
    "submit form": "onSubmit"
  },

  initialize: function initialize() {
    this.listenTo(items, "add", this.render);
    this.listenTo(items, "remove", this.render);
    this.listenTo(router, "route", this.route.bind(this));
  },

  route: function route(route) {
    if (route === "index") {
      this.render();
      this.delegateEvents();
    } else {
      this.undelegateEvents();
    }
  },

  onSubmit: function onSubmit(event) {
    event.preventDefault();
    var field = this.$("[name=\"newItem\"]");
    var item = field.val();
    field.val("");
    items.add({ name: item });
  },

  render: function render() {
    var ctx = this.model.toJSON();
    ctx.items = items.toJSON();

    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});