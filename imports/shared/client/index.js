import '../shared';
import './shared';
import './style.css';

SharedController = ApplicationController.extend({
  template: 'Shared',
  perPage: 25,
  subscriptions() {
    this.threadsSub = this.subscribe("shared.messages", {limit: this.limit()});
  },
  limit() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Counts.get(`shared.messages`) > this.limit();
    return {
      ready:    this.threadsSub.ready(),
      nextPath: hasMore ? nextPath : null,
    };
  }
});

Router.route('/shared', {
  name: 'shared',
  controller: 'SharedController'
});
