import './thread.html';
import './thread.css';

Template.Thread.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    if (data && !data.read) {
      Meteor.call("markRead", data._id, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
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
