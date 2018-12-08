import './channels.html';

Template.ChannelMenu.events({
  "click #btn-add-channel"(e, t) {
    e.preventDefault();
    Modal.show('AddChannelModal');
  },
  "click #btn-edit-channel"(e, t) {
    e.preventDefault();
    Modal.show('EditChannelModal', t.data.channel);
  }
});

Template.ChannelMenuItems.onCreated(function() {
  this.subscribe("channels");
});

Template.ChannelMenuItems.helpers({
  channels() {
    return Users.find({"profile.channel": true});
  }
});
