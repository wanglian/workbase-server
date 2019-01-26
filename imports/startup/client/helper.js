Template.registerHelper('company', function() {
  return Instance.company();
});

Template.registerHelper('count', function(name) {
  return Counts.get(`count-${name}`);
});

Template.registerHelper('countUnreadChannel', function(channel) {
  return Counts.get(`count-unread-channel-${channel}`);
});

Template.registerHelper('domain', function() {
  return Instance.domain();
});

Template.registerHelper('isMe', (user) => {
  let currentUser = Meteor.user();
  return currentUser && currentUser.isMe(user);
});

Template.registerHelper('inRouter', function(router) {
  return Router.current().route.getName() === router;
});
