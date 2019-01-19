import './inbox-layout';
import './log-message';
import './edit-message';
import './select-users-modal';
import './inbox';
import './thread';
import './message';
import './thread-detail';
import './thread-list';
import './message-form';
import './style.css';

InboxController = ApplicationController.extend({
  template: 'Inbox',
  perPage: 25,
  subscriptions() {
    this.threadsSub = this.subscribe("threads", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      this.subscribe("thread", threadId);
      this.subscribe("thread.files.pending", threadId);
    }
  },
  limit() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  threadId() {
    return this.params._id;
  },
  thread() {
    let threadId = this.threadId();
    return threadId && Threads.findOne(threadId);
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Counts.get('threads') > this.limit();
    let thread = this.thread();
    return {
      threads:    Threads.find({scope: 'private'}, {sort: {updatedAt: -1}}),
      thread,
      ready:      this.threadsSub.ready(),
      nextPath:   hasMore ? nextPath : null,
      hasRight:   !!thread,
      hasSidebar: !!thread && thread.showDetails && !!this.params.query.detail
    };
  }
});

Router.route('/inbox/:_id?', {
  name: 'inbox',
  controller: 'InboxController'
});

Threads.helpers({
  listTemplate(mode) {
    if (mode === 'simple') {
      let tmpl = `Simple${this.category}ListItem`;
      return eval(`Template.${tmpl}`) ? tmpl : 'SimpleThreadListItem';
    } else {
      let tmpl = `${this.category}ListItem`;
      return eval(`Template.${tmpl}`) ? tmpl : 'ThreadListItem';
    }
  }
});
