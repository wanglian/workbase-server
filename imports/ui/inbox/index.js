import './inbox';
import './style.css';

InboxController = ApplicationController.extend({
  template: 'Inbox',
  subscriptions() {
    this.subscribe("threads");
  },
  data() {
    return {
      threads: Threads.find({}, {sort: {updatedAt: -1}})
    };
  }
});

Router.route('/inbox', {
  name: 'inbox',
  controller: 'InboxController'
});