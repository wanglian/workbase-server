import './thread.html';
import './thread.css';

const PER_PAGE = 5;
Template.Thread.onCreated(function() {
  this.limit = new ReactiveVar(PER_PAGE);
  this.ready = new ReactiveVar(false);
});

Template.Thread.onRendered(function() {
  // === 分页
  let subThreadId, limit;
  this.autorun(() => {
    let data = Template.currentData();

    if (data._id) {
      // if (data._id === subThreadId && limit === this.limit.get()) {
      //   console.log("should not happen");
      //   return;
      // }
      // 重置消息分页数
      if (data._id != subThreadId) {
        console.log("reset limit");
        this.limit.set(PER_PAGE);
        subThreadId = data._id;
      }
      // 更新订阅
      console.log("sub messages");
      limit = this.limit.get();
      this.ready.set(false);
      let _this = this;
      this.subscribe("messages", data._id, {limit}, {
        onReady() {
          _this.ready.set(true);
        },
        onStop(e) {
          if (e) console.log(e);
          _this.ready.set(true);
        }
      });
    }
  });

  // === 标记已读
  let threadId, data;
  // 进入话题，延时两秒触发
  this.autorun(() => {
    data = Template.currentData();
    if (data && data._id != threadId) {
      threadId = data._id;
      if (this.timeout) Meteor.clearTimeout(this.timeout);
      this.timeout = Meteor.setTimeout(() => {
        if (!data.read) {
          Meteor.call("markRead", data._id, (err, res) => {
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
      Meteor.call("markRead", data._id, (err, res) => {
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
  }
});

Template.Thread.events({
  "click .btn-load-more"(e, t) {
    e.preventDefault();
    t.limit.set(t.limit.get() + PER_PAGE);
  }
});

Template.ThreadHeader.helpers({
  detailTitle() {
    return this._id && this.title('detail');
  }
});
