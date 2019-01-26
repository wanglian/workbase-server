import './thread.html';
import './thread.css';

const PER_PAGE = 20;

Template.Thread.onCreated(function() {
  this.limit = new ReactiveVar(PER_PAGE);
  this.ready = new ReactiveVar(false);
});

const MessageSubs = new SubsManager({
  cacheLimit: 20,
  expireIn: 30
});

Template.Thread.onRendered(function() {
  // === 分页
  let subThreadId, limit;
  let self = this;
  self.autorun(() => {
    let data = Template.currentData();

    if (data._id) {
      // if (data._id === subThreadId && limit === this.limit.get()) {
      //   console.log("should not happen");
      //   return;
      // }
      // 重置消息分页数
      if (data._id != subThreadId) {
        console.log("reset limit");
        self.limit.set(PER_PAGE);
        subThreadId = data._id;
      }
      // 更新订阅
      console.log("sub messages");
      limit = self.limit.get();
      let handle = MessageSubs.subscribe("thread.messages", data._id, {limit});
      self.ready.set(handle.ready());
    }
  });

  // === 标记已读
  let threadId, data;
  // 进入话题，延时两秒触发
  self.autorun(() => {
    data = Template.currentData();
    if (data && data._id != threadId) {
      threadId = data._id;
      if (self.timeout) Meteor.clearTimeout(self.timeout);
      self.timeout = Meteor.setTimeout(() => {
        if (!data.read) {
          markRead.call({
            threadId: data._id
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }, 2000);
    }
  });

  // 停留在话题时，滚动页面触发
  $('#inbox-right').on('scroll', (e) => {
    if (!data.read) {
      markRead.call({
        threadId: data._id
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

Template.Thread.onDestroyed(function() {
  if (this.timeout) Meteor.clearTimeout(this.timeout);
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
