import {View} from "backbone";
import router from "../routers/AppRouter";
import ItemsCollection from "../collections/ItemsCollection";

var items = new ItemsCollection([
  {name: 'Item 1'},
  {name: 'Item 2'},
  {name: 'Item 3'}
]);

export default View.extend({
  el: "#route-handler",
  template: require('../hbs/index.hbs'),

  events: {
    'submit form': 'onSubmit'
  },

  initialize() {
    this.listenTo(items, 'add', this.render);
    this.listenTo(items, 'remove', this.render);
    this.listenTo(router, 'route', this.route.bind(this));
  },

  route(route) {
    if (route === 'index') {
      this.render();
      this.delegateEvents();
    }
    else {
      this.undelegateEvents();
    }
  },

  onSubmit(event) {
    event.preventDefault();
    var field = this.$('[name="newItem"]');
    var item = field.val();
    field.val('');
    items.add({name: item});
  },

  render() {
    var ctx = this.model.toJSON();
    ctx.items = items.toJSON();

    var html = this.template(ctx);

    this.$el.html(html);
    return this;
  }
});
