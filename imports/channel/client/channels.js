import './channels.html';

Template.ChannelMenu.events({
  "click #btn-channel-members"(e, t) {
    e.preventDefault();
    Modal.show('ChannelMembersModal', t.data.channel, {
      backdrop: 'static'
    });
  },
  "click #btn-add-channel"(e, t) {
    e.preventDefault();
    Modal.show('AddChannelModal', null, {
      backdrop: 'static'
    });
  },
  "click #btn-edit-channel"(e, t) {
    e.preventDefault();
    Modal.show('EditChannelModal', t.data.channel, {
      backdrop: 'static'
    });
  }
});

Template.ChannelMenuItems.onCreated(function() {
  this.subscribe("channels");
});

Template.ChannelMenuItems.helpers({
  channels() {
    return ChannelUsers.find({userId: Meteor.userId()}).map((cu) => cu.channel());
  },
  inChannel(id) {
    return Router.current().params.channel === id;
  }
});
