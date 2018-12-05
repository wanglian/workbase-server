import './thread.html';
import './thread.css';

Template.ThreadHeader.helpers({
  detailShown() {
    let currentRoute = Router.current();
    let query = _.clone(currentRoute.params.query);
    return _.has(query, "detail");
  },
  detailPath() {
    let currentRoute = Router.current();
    let query = _.clone(currentRoute.params.query);
    if (_.has(query, "detail")) {
      query = _.omit(query, "detail");
    } else {
      _.extend(query, {detail: true})
    }
    return currentRoute.route.path(currentRoute.params, {query})
  }
});

Template.Thread.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    if (!data.read) {
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
