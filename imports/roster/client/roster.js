import './roster.html';

Template.RosterList.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.user) {
      $(`.thread#${data.user._id}`).addClass('active');
    }
  });
});

Template.RosterList.helpers({
  rosterPath() {
    let router = Router.current();
    let params = _.extend(router.params, {_id: this._id});
    return router.route.path(params);
  }
});

Template.RosterCard.helpers({
  bgColor() {
    return this.external() ? 'bg-green' : 'bg-yellow';
  }
});

Template.RosterCard.events({
  "click #btn-chat"(e, t) {
    e.preventDefault();

    Meteor.call('startChat', t.data._id, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        Router.go('inbox', {_id: res});
      }
    });
  }
});

Template.LinkToUser.events({
  "click .btn-user"(e, t) {
    if (this.user.className() === 'Users') {
      e.preventDefault();
      e.stopPropagation();
      Router.go('roster', {_id: this.user._id});
    }
  }
});
