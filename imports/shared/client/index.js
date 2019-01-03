import '../shared';
import './shared';
import './style.css';

SharedController = ApplicationController.extend({
  template: 'Shared',
  perPage: 25,
  subscriptions() {
    this.threadsSub = this.subscribe("shared.messages", this.userId(), {limit: this.limit()});
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
    let condition = {threadId: thread._id, parentId: {$exists: false}};
    let userId = this.userId();
    let user = userId && Users.findOne(userId);
    if (user) {
      _.extend(condition, {userId});
    }
    let messages = Messages.find(condition, {sort: {createdAt: -1}});

    return {
      thread,
      user,
      messages,
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
