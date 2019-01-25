import './roster.html';

Template.Roster.helpers({
  cardTemplate() {
    return this.type === 'Contacts' ? 'ContactCard' : 'RosterCard';
  }
});

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

Template.RosterHeader.events({
  "click .btn-edit-contact"(e, t) {
    e.preventDefault();
    Modal.show("EditContactModal", this, {
      backdrop: 'static'
    });
  }
});

Template.LinkToChat.events({
  "click #btn-chat"(e, t) {
    e.preventDefault();

    Meteor.call('startChat', this._id, (err, res) => {
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
