import './roster.html';

Modal.allowMultiple = true;

Template.RosterList.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.user) {
      $(`.thread#${data.user._id}`).addClass('active');
    }
  });
});

Template.RosterCard.helpers({
  hasChat() {
    return ThreadUsers.findOne({category: 'Chat', "params.chat": this._id});
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
      }
    });
  }
});

Template.RosterListModal.onRendered(function() {
  this.subscribe("roster");
});

Template.RosterListModal.helpers({
  users() {
    return Users.find({"profile.channel": {$ne: true}}, {sort: {"profile.name": 1}});
  }
});

Template.RosterListModal.events({
  "click #btn-add-roster"(e, t) {
    e.preventDefault();
    Modal.show('AddRosterModal', null, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click .btn-edit-roster"(e, t) {
    e.preventDefault();
    Modal.show('EditRosterModal', this, {
      backdrop: 'static',
      keyboard: false
    });
  }
});
