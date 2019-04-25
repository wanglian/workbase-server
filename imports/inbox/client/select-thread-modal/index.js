import './view.html';

// 选择会话
// params
// - excludeIds 排除在外的会话ID列表
// - callback 业务处理回调

Template.SelectThreadModal.onCreated(function() {
  this.ready = new ReactiveVar(false);
});

const ThreadSub = new SubsManager();
Accounts.onLogout(function() {
  ThreadSub.clear();
});

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
  "click .btn-start-thread"(e, t) {
    e.preventDefault();
    let cb = t.data.callback;
    Modal.show('SelectUsersModal', {
      excludeIds: [Meteor.userId()],
      callback(selectedUsers) {
        console.log(selectedUsers.length);
        let count = selectedUsers.length;
        if (count === 1) {
          // chat
          let userId = selectedUsers[0]._id;
          Meteor.call('startChat', userId, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res);
              cb && cb({
                thread: Threads._transform({_id: res, category: 'Chat', params: {chat: userId}})
              });
            }
          });
        } else if (count > 1) {
          // group
          let userIds = selectedUsers.map((u) => u._id);
          userIds.push(Meteor.userId());
          Meteor.call("startGroup", userIds, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res);
              cb && cb({
                newThread: true,
                threadId: res
              });
            }
          });
        }
        $('#SelectUsersModal button[class=close]').click();
      }
    }, {
      backdrop: 'static'
    });
  },
  "click .btn-select-thread"(e, t) {
    e.preventDefault();
    let cb = t.data.callback;
    cb && cb({thread: this});
  }
});
