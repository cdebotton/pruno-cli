import React from "react/addons";
import {RouteHandler} from "react-router";
import AppStore from "../stores/AppStore";
import {StoreListenerMixin} from "fluxd";

var {classSet} = React.addons;

var App = React.createClass({
  mixins: [StoreListenerMixin],

  getInitialState() {
    return {toggle: AppStore.getState().toggle};
  },

  componentDidMount() {
    this.listenTo(AppStore, this.onStoreChange);
  },

  onStoreChange() {
    this.setState(
      this.getInitialState()
    );
  },

  render() {
    var cx = classSet({
      "active": this.state.toggle
    });

    return (
      <html lang="en">
      <head>
        <title>My Application</title>
      </head>
      <body>
        <h2 className={cx}>Hello, World!</h2>
        <p>Active? {this.state.toggle ? 'Yes' : 'No'}.</p>
        <RouteHandler />
      </body>
      </html>
    );
  }
});

export default App;
