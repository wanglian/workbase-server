import './index.html';

// 选择会话
// params
// - excludeIds 排除在外的会话ID列表
// - callback 业务处理回调

Template.SelectThreadModal.onCreated(function() {
  this.ready = new ReactiveVar(false);
});

const ThreadSub = new SubsManager();

Template.SelectThreadModal.onRendered(function() {
  let self = this;
  self.autorun(() => {
    let sub = ThreadSub.subscribe("threads");
    self.ready.set(sub.ready());
  });
});

Template.SelectThreadModal.helpers({
  threads() {
    return Threads.find({scope: 'private', _id: {$nin: this.excludeIds}}, {sort: {updatedAt: -1}});
  },
  ready() {
    return Template.instance().ready.get();
  }
});

Template.SelectThreadModal.events({
  "click .btn-select-thread"(e, t) {
    e.preventDefault();
    let cb = t.data.callback;
    cb && cb(this);
  }
});
