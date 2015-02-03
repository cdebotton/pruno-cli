import {View} from "backbone";
import router from "../routers/AppRouter";

export default View.extend({
  el: '#route-handler',
  template: require('../hbs/about.hbs'),

  initialize() {
    this.listenTo(router, 'route', this.route.bind(this));
  },

  route(route) {
    if (route === 'about') {
      this.render();
      this.delegateEvents();
    }
    else {
      this.undelegateEvents();
    }
  },

  render() {
    var ctx = this.model.toJSON();
    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});
