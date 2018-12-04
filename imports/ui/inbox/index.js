import './inbox-layout';
import './inbox';
import './thread';
import './message';
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
    return this.params.query.id;
  },
  thread() {
    let threadId = this.threadId();
    return threadId && Threads.findOne(threadId);
  },
  data() {
    return {
      threads: Threads.find({}, {sort: {updatedAt: -1}}),
      thread: this.thread()
    };
  }
});

Router.route('/inbox', {
  name: 'inbox',
  controller: 'InboxController'
});