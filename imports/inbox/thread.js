import './thread.html';
import './thread.css';

Template.Thread.onRendered(function() {
  this.autorun(() => {
    this.subscribe("messages", this.data.threadId);
  });

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
  messages() {
    return Messages.find({threadId: this._id}, {sort: {createdAt: -1}});
  }
});

Template.Thread.events({
  "click .btn-detail"(e, t) {
    e.preventDefault();
    let currentRoute = Router.current();
    currentRoute.route.path(currentRoute.params, {query: _.extend(currentRoute.query, {detail: true})})
  }
});

Template.ThreadHeader.helpers({
  detailTitle() {
    return this._id && this.title('detail');
  }
});
