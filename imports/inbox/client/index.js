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

StarController = BoxController.extend({
  template: 'Star',
  subscriptions() {
    this.sub = InboxSubs.subscribe("threads.star", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      InboxSubs.subscribe("thread", threadId);
      InboxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({star: true}, {sort: {updatedAt: -1}});
  },
  nextPath() {
    let count = Counts.get('count-star');
    if (count > this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
  }
});

Router.route('/star/:_id?', {
  name: 'star',
  controller: 'StarController'
});

ArchiveController = BoxController.extend({
  template: 'Archive',
  subscriptions() {
    this.sub = InboxSubs.subscribe("threads.archive", {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      InboxSubs.subscribe("thread", threadId);
      InboxSubs.subscribe("thread.files.pending", threadId);
    }
  },
  threads() {
    return Threads.find({archive: true}, {sort: {updatedAt: -1}});
  },
  nextPath() {
    let count = this.threads().count();
    if (count == this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
  }
});

Router.route('/archive/:_id?', {
  name: 'archive',
  controller: 'ArchiveController'
});

