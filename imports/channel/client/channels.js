import './channels.html';

Template.ChannelMenu.events({
  "click #btn-channel-members"(e, t) {
    e.preventDefault();
    Modal.show('ChannelMembersModal', t.data.channel, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click #btn-add-channel"(e, t) {
    e.preventDefault();
    Modal.show('AddChannelModal', null, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click #btn-edit-channel"(e, t) {
    e.preventDefault();
    Modal.show('EditChannelModal', t.data.channel, {
      backdrop: 'static',
      keyboard: false
    });
  }
});

Template.ChannelMenuItems.onCreated(function() {
  this.subscribe("channels");
});

Template.ChannelMenuItems.helpers({
  channels() {
    return Users.find({"profile.type": 'Channels'});
  }
});
