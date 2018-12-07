import './channels.html';

Template.ChannelMenuItems.onCreated(function() {
  this.subscribe("channels");
});

Template.ChannelMenuItems.helpers({
  isChannel(id) {
    let router = Router.current();
    return router.route.getName() === 'channel' && router.params.channel === id;
  },
  channels() {
    return Users.find({"profile.channel": true});
  }
});
