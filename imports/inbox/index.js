import './inbox-layout';
import './inbox';
import './thread';
import './message';
import './thread-detail';
import './thread-list';
import './message-form';
import './style.css';

InboxController = ApplicationController.extend({
  template: 'Inbox',
  subscriptions() {
    this.subscribe("threads");
    let threadId = this.threadId();
    if (threadId) {
      this.subscribe("thread", threadId);
      this.subscribe("messages", threadId);
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
  threads() {
    return Threads.find({}, {sort: {updatedAt: -1}});
  },
  data() {
    return {
      threads: this.threads(),
      thread: this.thread(),
      hasRight: !!this.thread(),
      hasSidebar: !!this.detail()
    };
  }
});

Router.route('/inbox/:_id?', {
  name: 'inbox',
  controller: 'InboxController'
});