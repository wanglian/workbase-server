import './roster.html';

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
