import '../shared';
import './shared';
import './style.css';

const ShareSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});
Accounts.onLogout(function() {
  ShareSubs.clear();
});

SharedController = ApplicationController.extend({
  template: 'Shared',
  perPage: 25,
  subscriptions() {
    this.threadsSub = ShareSubs.subscribe("shared.messages", this.userId(), {limit: this.limit()});
  },
  limit() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  userId() {
    return this.params._id;
  },
  thread() {
    return Threads.findOne({category: 'Shared'});
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Counts.get(`shared.messages`) > this.limit();

    let thread = this.thread();
    let userId = this.userId();
    let user = userId && Users.findOne(userId);

    return {
      thread,
      user,
      ready:    this.threadsSub.ready(),
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/shared/:_id?', {
  name: 'shared',
  controller: 'SharedController'
});

Accounts.onLogin(function(attempt) {
  Meteor.subscribe("shared.thread");
});
