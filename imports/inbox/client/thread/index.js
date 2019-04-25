import './view.html';
import './style.css';

const PER_PAGE = 20;

Template.Thread.onCreated(function() {
  this.limit = new ReactiveVar(PER_PAGE);
  this.ready = new ReactiveVar(false);
});

const MessageSubs = new SubsManager({
  cacheLimit: 20,
  expireIn: 30
});
Accounts.onLogout(function() {
  MessageSubs.clear();
});

Template.Thread.onRendered(function() {
  let self = this;
  let data, threadId;
  let limit, handle; // pagination
  self.autorun(() => {
    data = Template.currentData();
    if (data && data._id !== threadId) {
      // mark read: delay 2s
      if (self.timeout) {
        Meteor.clearTimeout(self.timeout);
      }
      self.timeout = Meteor.setTimeout(() => {
        if (!data.read) {
          markRead.call({
            threadId
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }, 2000);
    }
    if (data && data._id) {
      if (data._id !== threadId) {
        // reset pagination
        threadId = data._id;
        console.log("reset limit - " + threadId);
        self.limit.set(PER_PAGE);
      }
      limit = self.limit.get();
      console.log("sub messages - " + threadId + " - " + limit);
      handle = MessageSubs.subscribe("thread.messages", threadId, {limit});
      self.ready.set(handle.ready());
    }
  });

  // mark read: tiggered by scrolling
  $('#inbox-right').on('scroll', (e) => {
    if (!data.read) {
      markRead.call({
        threadId
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

Template.Thread.onDestroyed(function() {
  if (this.timeout) {
    Meteor.clearTimeout(this.timeout);
  }
  $('#inbox-right').off('scroll');
});

Template.Thread.helpers({
  ready() {
    return Template.instance().ready.get();
  },
  hasMore() {
    let tmpl = Template.instance();
    return this._id && Counts.get(`messages.${this._id}`) > tmpl.limit.get();
  },
  messages() {
    return Messages.find({threadId: this._id}, {sort: {createdAt: -1}});
  },
  messageTemplate() {
    switch(this.contentType) {
    case 'log':
      return 'LogMessage';
    default:
      return 'Message';
    }
  }
});

Template.Thread.events({
  "click .btn-load-more"(e, t) {
    e.preventDefault();
    t.limit.set(t.limit.get() + PER_PAGE);
  }
});

Template.ThreadMenu.helpers({
  menuIcon() {
    if (typeof(this.icon) === 'function') {
      let thread = Template.instance().data;
      return this.icon.apply(this, [thread]);
    }
    return this.icon;
  },
  menuTitle() {
    if (typeof(this.title) === 'function') {
      let thread = Template.instance().data;
      return this.title.apply(this, [thread]);
    }
    return this.title;
  }
});

Template.ThreadMenu.events({
  "click .btn-action"(e, t) {
    e.preventDefault();
    this.action.apply(this, [t.data]);
  }
});
