"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react"));

var AppActionCreators = _interopRequire(require("../actions/AppActionCreators"));

var IndexRoute = React.createClass({
  displayName: "IndexRoute",
  onActivate: function onActivate() {
    AppActionCreators.activate();
  },

  onDeactivate: function onDeactivate() {
    AppActionCreators.deactivate();
  },

  onToggle: function onToggle() {
    AppActionCreators.toggle();
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "index-route" },
      React.createElement(
        "h2",
        null,
        "IndexRoute"
      ),
      React.createElement(
        "button",
        { onClick: this.onActivate },
        "Activate"
      ),
      React.createElement(
        "button",
        { onClick: this.onDeactivate },
        "Deactivate"
      ),
      React.createElement(
        "button",
        { onClick: this.onToggle },
        "Toggle"
      )
    );
  }
});

module.exports = IndexRoute;