import './channels.html';

Template.Channels.onCreated(function() {
  this.subscribe("channels");
});

Template.Channels.helpers({
  isChannel(id) {
    let router = Router.current();
    return router.route.getName() === 'channel' && router.params._id === id;
  },
  channels() {
    return Users.find({"profile.channel": true});
  }
});
