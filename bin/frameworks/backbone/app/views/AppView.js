import {View, history} from "backbone";
import router from "../routers/AppRouter";
import IndexView from "./IndexView";
import AboutView from "./AboutView";

export default View.extend({
  el: '#app-mount',
  template: require('../hbs/app.hbs'),

  events: {
    'click nav a': 'loadPage'
  },

  initialize() {
    this.render();
    this.pages = {
      index: new IndexView({model: this.model}),
      about: new AboutView({model: this.model})
    };
  },

  loadPage(event) {
    event.preventDefault();
    var path = event.target.pathname;
    router.navigate(path, {trigger: true});
  },

  render() {
    var ctx = this.model.toJSON();
    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});
