import './channels.html';

Template.Channels.onCreated(function() {
  this.subscribe("channels");
});

Template.Channels.helpers({
  channels() {
    return Users.find({"profile.channel": true});
  }
});
