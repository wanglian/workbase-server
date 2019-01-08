import '../account';
import './avatar-files';
import './profile';
import './style.css';

Router.route('/profile', function() {
  let account = Threads.findOne({category: 'Account', userId: Meteor.userId()});
  Router.go('inbox', {_id: account._id});
}, {
  name: 'profile'
});

AdminController = ApplicationController.extend({
  template: 'Admin',
  subscriptions() {
    this.threadsSub = this.subscribe("admin.threads");
    let threadId = this.threadId();
    if (threadId) {
      this.subscribe("thread", threadId);
      this.subscribe("thread.files.pending", threadId);
    }
  },
  threadId() {
    return this.params._id;
  },
  detail() {
    return this.params.query.detail;
  },
  thread() {
    let threadId = this.threadId();
    return threadId && Threads.findOne(threadId);
  },
  data() {
    let query = _.clone(this.params.query);
    let thread = this.thread();
    return {
      threads:    Threads.find({"params.admin": true}, {sort: {updatedAt: -1}}),
      thread,
      ready:      this.threadsSub.ready(),
      hasRight:   !!thread,
      hasSidebar: !!thread && thread.showDetails && !!this.params.query.detail
    };
  }
});

Router.route('/admin/:_id?', {
  name: 'admin',
  controller: 'AdminController'
});
