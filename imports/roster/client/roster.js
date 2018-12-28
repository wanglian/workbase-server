import './roster.html';

Template.RosterMenu.events({
  "click #btn-add-roster"(e, t) {
    e.preventDefault();
    Modal.show('AddRosterModal', null, {
      backdrop: 'static'
    });
  },
  "click #btn-edit-roster"(e, t) {
    e.preventDefault();
    Modal.show('EditRosterModal', t.data, {
      backdrop: 'static'
    });
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
        Router.go('inbox', {_id: res});
      }
    });
  }
});
