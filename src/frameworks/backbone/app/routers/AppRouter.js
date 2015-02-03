import {Router} from "backbone";

var AppRouter = Router.extend({
  routes: {
    "": "index",
    "about": "about"
  }
});

export default new AppRouter;
