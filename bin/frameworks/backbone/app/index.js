import Backbone from "backbone";
import {history} from "backbone";
import $ from "jquery";
import AppView from "./views/AppView";
import AppModel from "./models/AppModel";
import AppRouter from "./routers/AppRouter";

Backbone.$ = $;
var application = new AppView({
  model: new AppModel()
});

history.start({pushState: false});
