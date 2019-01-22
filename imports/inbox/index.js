import './inbox-layout';
import './log-message';
import './edit-message';
import './select-users-modal';
import './select-thread-modal';
import './inbox';
import './thread';
import './message';
import './thread-detail';
import './thread-list';
import './message-form';
import './style.css';

const InboxSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});

InboxController = ApplicationController.extend({
  template: 'Inbox',
  perPage: 25,
  subscriptions() {
    this.threadsSub = InboxSubs.subscribe("threads", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      InboxSubs.subscribe("thread", threadId);
      InboxSubs.subscribe("thread.files.pending", threadId);
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

Template.registerHelper('threadTitle', (thread, detail) => {
  let c = ThreadCategories.get(thread.category);
  if (!c) {
    return false; // happens when data not ready
  }
  return typeof(c.title) == "function" ? c.title(thread, detail) : thread.subject;
});

Template.registerHelper('threadListTemplate', (thread, mode) => {
  if (mode === 'simple') {
    let tmpl = `Simple${thread.category}ListItem`;
    return eval(`Template.${tmpl}`) ? tmpl : 'SimpleThreadListItem';
  } else {
    let tmpl = `${thread.category}ListItem`;
    return eval(`Template.${tmpl}`) ? tmpl : 'ThreadListItem';
  }
});

Template.registerHelper('localizedMessageSummary', Messages.localizedSummary);
