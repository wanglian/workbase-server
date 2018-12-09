import './inbox.html';

Template.InboxMenu.events({
  "click #btn-add-channel"(e, t) {
    e.preventDefault();
    Modal.show('AddChannelModal');
  },
  "click #btn-add-roster"(e, t) {
    e.preventDefault();
    Modal.show('AddRosterModal');
  }
});
