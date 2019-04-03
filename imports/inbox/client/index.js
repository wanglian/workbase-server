import './inbox-layout';
import './thread';
import './message';
import './thread-list';
import './message-form';
import './thread-detail';
import './log-message';
import './edit-message';
import './pin-messages';
import './select-users-modal';
import './select-thread-modal';
import './send-email-modal';
import './thread-notes-modal';
import './upload-file';
import './helpers';
import './inbox.html';
import './star.html';
import './archive.html';
import './spam.html';
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
  totalCount() {
    // to be implemented
  },
  nextPath() {
    if (this.totalCount() > this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
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

const BoxSubs = new SubsManager({
  cacheLimit: 20,
  expireIn: 10
});
Accounts.onLogout(function() {
  BoxSubs.clear();
});

InboxController = BoxController.extend({
  template: 'Inbox',
  subscriptions() {
    this.sub = BoxSubs.subscribe("threads", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      BoxSubs.subscribe("thread", threadId);
      BoxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({scope: 'private', archive: {$ne: true}, spam: {$ne: true}}, {sort: {updatedAt: -1}});
  },
  totalCount() {
    return Counts.get('threads');
  }
});

Router.route('/inbox/:_id?', {
  name: 'inbox',
  controller: 'InboxController'
});

StarController = BoxController.extend({
  template: 'Star',
  subscriptions() {
    this.sub = BoxSubs.subscribe("threads.star", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      BoxSubs.subscribe("thread", threadId);
      BoxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({star: true}, {sort: {updatedAt: -1}});
  },
  totalCount() {
    return Counts.get('count-star');
  }
});

Router.route('/star/:_id?', {
  name: 'star',
  controller: 'StarController'
});

ArchiveController = BoxController.extend({
  template: 'Archive',
  subscriptions() {
    this.sub = BoxSubs.subscribe("threads.archive", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      BoxSubs.subscribe("thread", threadId);
      BoxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({archive: true}, {sort: {updatedAt: -1}});
  },
  totalCount() {
    return Counts.get('count-archive');
  }
});

Router.route('/archive/:_id?', {
  name: 'archive',
  controller: 'ArchiveController'
});

SpamController = BoxController.extend({
  template: 'Spam',
  subscriptions() {
    this.sub = BoxSubs.subscribe("threads.spam", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      BoxSubs.subscribe("thread", threadId);
      BoxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({spam: true}, {sort: {updatedAt: -1}});
  },
  totalCount() {
    return Counts.get('count-spam');
  }
});

Router.route('/spam/:_id?', {
  name: 'spam',
  controller: 'SpamController'
});
