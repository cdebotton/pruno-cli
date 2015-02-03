"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var React = _interopRequire(require("react/addons"));

var RouteHandler = require("react-router").RouteHandler;
var AppStore = _interopRequire(require("../stores/AppStore"));

var StoreListenerMixin = require("fluxd").StoreListenerMixin;
var classSet = React.addons.classSet;


var App = React.createClass({
  displayName: "App",
  mixins: [StoreListenerMixin],

  getInitialState: function getInitialState() {
    return { toggle: AppStore.getState().toggle };
  },

  componentDidMount: function componentDidMount() {
    this.listenTo(AppStore, this.onStoreChange);
  },

  onStoreChange: function onStoreChange() {
    this.setState(this.getInitialState());
  },

  render: function render() {
    var cx = classSet({
      active: this.state.toggle
    });

    return React.createElement(
      "html",
      { lang: "en" },
      React.createElement(
        "head",
        null,
        React.createElement(
          "title",
          null,
          "My Application"
        )
      ),
      React.createElement(
        "body",
        null,
        React.createElement(
          "h2",
          { className: cx },
          "Hello, World!"
        ),
        React.createElement(
          "p",
          null,
          "Active? ",
          this.state.toggle ? "Yes" : "No",
          "."
        ),
        React.createElement(RouteHandler, null)
      )
    );
  }
});

module.exports = App;