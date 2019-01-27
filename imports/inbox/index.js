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

BoxController = ApplicationController.extend({
  perPage: 25,
  subscriptions() {
    // to be implemented
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
  threads() {
    // to be implemented
  },
  nextPath() {
    // to be implemented
  },
  data() {
    return {
      threads:    this.threads(),
      thread:     this.thread(),
      ready:      this.sub.ready(),
      nextPath:   this.nextPath(),
      hasRight:   !!this.threadId(),
      hasSidebar: !!this.params.query.detail
    };
  }
});

const InboxSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});
Accounts.onLogout(function() {
  InboxSubs.clear();
});

InboxController = BoxController.extend({
  template: 'Inbox',
  subscriptions() {
    this.sub = InboxSubs.subscribe("threads", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      InboxSubs.subscribe("thread", threadId);
      InboxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({scope: 'private', archive: {$ne: true}}, {sort: {updatedAt: -1}});
  },
  nextPath() {
    let count = Counts.get('threads');
    if (count > this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
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
